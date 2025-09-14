#!/usr/bin/env node

/**
 * AI生成内容验证脚本
 * 用于验证AI生成的代码和文档是否符合项目约束
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIOutputValidator {
  constructor() {
    this.constraints = this.loadConstraints();
    this.validationResults = [];
  }

  loadConstraints() {
    const constraintsPath = path.join(__dirname, '..', 'docs', 'ai-prompt-constraints.md');
    if (fs.existsSync(constraintsPath)) {
      return fs.readFileSync(constraintsPath, 'utf8');
    }
    return null;
  }

  validateFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const results = [];

    // 文件存在性检查
    if (!fs.existsSync(filePath)) {
      results.push({ type: 'error', message: `文件不存在: ${filePath}` });
      return results;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // 通用验证
    results.push(...this.validateCommon(content, filePath));

    // 特定文件类型验证
    switch (ext) {
      case '.cs':
        results.push(...this.validateCSharp(content, filePath));
        break;
      case '.ts':
      case '.vue':
        results.push(...this.validateTypeScript(content, filePath));
        break;
      case '.md':
        results.push(...this.validateMarkdown(content, filePath));
        break;
      case '.json':
        results.push(...this.validateJson(content, filePath));
        break;
    }

    return results;
  }

  validateCommon(content, filePath) {
    const results = [];
    
    // 检查禁止的技术（仅针对代码文件；跳过 docs/*.md、.trae 下的内容，避免在说明文档中误报）
    const ext = path.extname(filePath).toLowerCase();
    const isDocLike = ext === '.md' || ext === '.xlsx' || filePath.includes(`${path.sep}docs${path.sep}`) || filePath.includes(`${path.sep}.trae${path.sep}`);
    const baseName = path.basename(filePath);
    const isMeta = baseName === '.ai-constraints.json';
    if (!isDocLike && !isMeta) {
      const root = path.join(__dirname, '..');
      const constraintsFile = path.join(root, '.ai-constraints.json');
      let banned = {
        frontend: ["Vuex", "jQuery", "Bootstrap", "Element UI", "Vuetify", "@vue/composition-api"],
        backend: ["EntityFramework", "Dapper", "NHibernate"]
      };
      try {
        if (fs.existsSync(constraintsFile)) {
          const raw = JSON.parse(fs.readFileSync(constraintsFile, 'utf8'));
          if (raw?.technologyStack?.banned) {
            banned = {
              frontend: raw.technologyStack.banned.frontend || banned.frontend,
              backend: raw.technologyStack.banned.backend || banned.backend
            };
          }
        }
      } catch (_) {}

      const bannedPatterns = [
        ...banned.backend.map(x => new RegExp(x, 'i')),
        ...banned.frontend.map(x => new RegExp(x, 'i'))
      ];

      bannedPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          results.push({ 
            type: 'error', 
            message: `检测到禁止的技术: ${pattern.toString()} 在文件 ${filePath}` 
          });
        }
      });
    }


    // 检查代码风格（仅针对代码文件，跳过 .md/.json/.yml/.yaml 等文档与数据文件）
    const codeExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.cs', '.vue', '.cshtml']);
    const isCodeFile = codeExts.has(ext);
    if (isCodeFile) {
      if (content.includes('拼音') || content.match(/[a-zA-Z]*[0-9]{3,}[a-zA-Z]*/)) {
        results.push({ 
          type: 'warning', 
          message: `可能存在拼音命名或魔法数字在文件 ${filePath}` 
        });
      }
    }

    return results;
  }

  validateCSharp(content, filePath) {
    const results = [];
    
    // 检查SqlSugar使用
    if (!content.includes('SqlSugar') && content.includes('DbContext')) {
      results.push({ 
        type: 'error', 
        message: `应该使用SqlSugar而不是EntityFramework在文件 ${filePath}` 
      });
    }

    // 检查注释规范
    const summaryPattern = /\/\/\/\s*<summary>[\s\S]*?<\/summary>/g;
    if (!summaryPattern.test(content)) {
      results.push({ 
        type: 'warning', 
        message: `C#文件缺少标准注释在文件 ${filePath}` 
      });
    }

    return results;
  }

  validateTypeScript(content, filePath) {
    const results = [];
    
    // 检查Vue 3 Composition API
    if (content.includes('options') && content.includes('data()') && !content.includes('setup')) {
      results.push({ 
        type: 'warning', 
        message: `应该使用Composition API而不是Options API在文件 ${filePath}` 
      });
    }

    // 检查Pinia使用
    if (content.includes('Vuex') && !content.includes('Pinia')) {
      results.push({ 
        type: 'error', 
        message: `应该使用Pinia而不是Vuex在文件 ${filePath}` 
      });
    }

    return results;
  }

  validateMarkdown(content, filePath) {
    const results = [];
    const lines = content.split(/\r?\n/);

    // 新增：强制“依据与来源”小节（对生成物生效；对基础规范文档放行）
    const baseName = path.basename(filePath);
    const whitelist = new Set([
      '智能体提示词.md',
      'architecture.md',
      'design-constraints.md',
      'README.md',
      'task-tracking.md',
      'user-management-example.md'
    ]);

    const isInTrae = filePath.includes(`${path.sep}.trae${path.sep}`);
    const isWhitelisted = isInTrae || whitelist.has(baseName);

    if (!isWhitelisted) {
      if (!/依据与来源/.test(content)) {
        results.push({ 
          type: 'error', 
          message: `文档未包含强制小节“依据与来源”，请按 docs/智能体提示词.md 的“文档强制关联规则”补充: ${filePath}` 
        });
      } else {
        // 新增："依据与来源" 段落至少包含一条来源项（链接、<mcreference> 或列表项）
        const sectionIndex = lines.findIndex(l => /^(#{1,6}\s*)?依据与来源/.test(l));
        if (sectionIndex !== -1) {
          let hasSourceItem = false;
          for (let i = sectionIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (/^\s*#/.test(line)) break; // 下一个标题，结束本段检查
            if (/\bhttps?:\/\/\S+/.test(line) || /<mcreference\b/.test(line) || /^\s*[-*]\s+/.test(line)) {
              hasSourceItem = true;
              break;
            }
          }
          if (!hasSourceItem) {
            results.push({ 
              type: 'error', 
              message: `“依据与来源”段落至少包含一条来源项（链接、<mcreference> 或带条目的列表项）: ${filePath}` 
            });
          }
        }
      }

      // 新增：Prompt-Ref 检查（含位置约束：前30行）与 prompts.json 交叉校验
      const promptRefLineIndex = lines.findIndex(l => /Prompt-Ref:\s*prompt:id=([a-zA-Z0-9_\-]+)/.test(l));
      const promptRefMatch = content.match(/Prompt-Ref:\s*prompt:id=([a-zA-Z0-9_\-]+)/);
      if (!promptRefMatch) {
        results.push({
          type: 'error',
          message: `缺少 Prompt-Ref 头部标记（形如：Prompt-Ref: prompt:id=<prompts.json 中的条目 id>）: ${filePath}`
        });
      } else {
        if (promptRefLineIndex > 29) {
          results.push({
            type: 'error',
            message: `Prompt-Ref 必须位于文档前30行内（当前在第 ${promptRefLineIndex + 1} 行）: ${filePath}`
          });
        }
        const promptId = promptRefMatch[1];
        try {
          const promptsPath = path.join(__dirname, '..', 'docs', 'prompts.json');
          if (!fs.existsSync(promptsPath)) {
            results.push({
              type: 'error',
              message: `未找到 docs/prompts.json，无法校验 Prompt-Ref: ${filePath}`
            });
          } else {
            const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
            const list = Array.isArray(prompts.prompts) ? prompts.prompts : [];
            const exists = list.some(p => p.id === promptId);
            if (!exists) {
              results.push({
                type: 'error',
                message: `Prompt-Ref 引用的 id 未在 docs/prompts.json 中找到: ${promptId} （文件: ${filePath}）`
              });
            }
          }
        } catch (e) {
          results.push({
            type: 'error',
            message: `校验 Prompt-Ref 时发生错误: ${e.message} （文件: ${filePath}）`
          });
        }
      }
    }
    
    // 检查文档结构
    const requiredSections = ['##', '###', '####'];
    const hasStructure = requiredSections.some(section => content.includes(section));
    
    if (!hasStructure) {
      results.push({ 
        type: 'warning', 
        message: `Markdown文档缺乏结构化标题在文件 ${filePath}` 
      });
    }

    return results;
  }

  validateJson(content, filePath) {
    const results = [];
    
    try {
      JSON.parse(content);
    } catch (e) {
      results.push({ 
        type: 'error', 
        message: `JSON格式错误在文件 ${filePath}: ${e.message}` 
      });
    }

    return results;
  }

  validateDirectory(dirPath) {
    const results = [];
    
    if (!fs.existsSync(dirPath)) {
      results.push({ type: 'error', message: `目录不存在: ${dirPath}` });
      return results;
    }

    // 轻量一致性校验：prompts.json 与 .ai-constraints.json 的 banned_technologies 完全一致
    try {
      const root = path.join(__dirname, '..');
      const constraintsFile = path.join(root, '.ai-constraints.json');
      const promptsFile = path.join(root, 'docs', 'prompts.json');
      if (fs.existsSync(constraintsFile) && fs.existsSync(promptsFile)) {
        const constraints = JSON.parse(fs.readFileSync(constraintsFile, 'utf8'));
        const prompts = JSON.parse(fs.readFileSync(promptsFile, 'utf8'));
        const a = (constraints?.technologyStack?.banned) || {};
        const b = (prompts?.banned_technologies) || {};
        const arrEq = (x = [], y = []) => {
          if (x.length !== y.length) return false;
          const sx = [...x].map(s=>s.toLowerCase()).sort();
          const sy = [...y].map(s=>s.toLowerCase()).sort();
          return sx.every((v,i)=>v===sy[i]);
        };
        const feOk = arrEq(a.frontend || [], b.frontend || []);
        const beOk = arrEq(a.backend || [], b.backend || []);
        if (!feOk || !beOk) {
          results.push({
            type: 'error',
            message: `banned_technologies 不一致: frontend一致=${feOk}, backend一致=${beOk}。请同步 .ai-constraints.json 与 docs/prompts.json`
          });
        }
      }
    } catch (e) {
      results.push({ type: 'warning', message: `一致性校验时出现问题：${e.message}` });
    }

    const files = this.getFiles(dirPath);
    files.forEach(file => {
      const fileResults = this.validateFile(file);
      results.push(...fileResults);
    });

    return results;
  }

  getFiles(dirPath) {
    let results = [];
    const list = fs.readdirSync(dirPath);

    list.forEach(file => {
      file = path.join(dirPath, file);
      const stat = fs.statSync(file);
      
      if (stat && stat.isDirectory()) {
        results = results.concat(this.getFiles(file));
      } else {
        results.push(file);
      }
    });

    return results.filter(file => 
      ['.cs', '.ts', '.vue', '.md', '.json'].includes(path.extname(file))
    );
  }

  generateReport(results) {
    const errors = results.filter(r => r.type === 'error');
    const warnings = results.filter(r => r.type === 'warning');

    console.log('=== AI生成内容验证报告 ===');
    console.log(`总检查文件数: ${results.length}`);
    console.log(`错误: ${errors.length}`);
    console.log(`警告: ${warnings.length}`);
    console.log('');

    if (errors.length > 0) {
      console.log('错误详情:');
      errors.forEach((e, idx) => {
        console.log(`${idx + 1}. ${e.message}`);
      });
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('警告详情:');
      warnings.forEach((w, idx) => {
        console.log(`${idx + 1}. ${w.message}`);
      });
      console.log('');
    }

    return { passed: errors.length === 0, errors, warnings };
  }
}

if (require.main === module) {
  const validator = new AIOutputValidator();

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('用法: node validate-ai-output.js <文件或目录路径>');
    process.exit(1);
  }

  const targetPath = path.resolve(args[0]);
  let results = [];

  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      results = validator.validateDirectory(targetPath);
    } else {
      results = validator.validateFile(targetPath);
    }
  } else {
    console.log(`路径不存在: ${targetPath}`);
    process.exit(1);
  }

  const report = validator.generateReport(results);
  process.exit(report.passed ? 0 : 1);
}

module.exports = AIOutputValidator;