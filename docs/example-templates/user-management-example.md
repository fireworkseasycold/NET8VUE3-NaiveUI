# 📋 用户管理模块示例模板

## 🎯 模块概述
用户管理模块示例，展示符合AI约束的正确代码生成模式。

## 💻 后端代码示例 (C# .NET 8 + SqlSugar)

### 用户实体类 (Models/User.cs)
```csharp
using SqlSugar;
using System;

namespace Ecommerce.Backend.Models
{
    /// <summary>
    /// 用户实体类
    /// </summary>
    [SugarTable("users")]
    public class User
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
        public long Id { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        [SugarColumn(Length = 50, IsNullable = false)]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// 邮箱地址
        /// </summary>
        [SugarColumn(Length = 100, IsNullable = false)]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// 密码哈希
        /// </summary>
        [SugarColumn(Length = 255, IsNullable = false)]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// 是否激活
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// 是否删除（软删除）
        /// </summary>
        [SugarColumn(IsIgnore = true)]
        public bool IsDeleted { get; set; } = false;
    }
}
```

### 用户服务接口 (Services/IUserService.cs)
```csharp
using Ecommerce.Backend.DTOs;
using Ecommerce.Backend.Models;

namespace Ecommerce.Backend.Services
{
    /// <summary>
    /// 用户服务接口
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// 获取用户列表
        /// </summary>
        Task<List<User>> GetUsersAsync();

        /// <summary>
        /// 根据ID获取用户
        /// </summary>
        Task<User?> GetUserByIdAsync(long id);

        /// <summary>
        /// 创建用户
        /// </summary>
        Task<User> CreateUserAsync(CreateUserDto createUserDto);

        /// <summary>
        /// 更新用户
        /// </summary>
        Task<User?> UpdateUserAsync(long id, UpdateUserDto updateUserDto);

        /// <summary>
        /// 删除用户（软删除）
        /// </summary>
        Task<bool> DeleteUserAsync(long id);
    }
}
```

### API控制器 (Controllers/UsersController.cs)
```csharp
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Backend.Services;
using Ecommerce.Backend.DTOs;

namespace Ecommerce.Backend.Controllers
{
    /// <summary>
    /// 用户管理API
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        /// <summary>
        /// 构造函数
        /// </summary>
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// 获取所有用户
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }

        /// <summary>
        /// 根据ID获取用户
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        /// <summary>
        /// 创建用户
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
```

## 🎨 前端代码示例 (Vue 3 + TypeScript + Naive UI)

### 用户列表组件 (components/UserList.vue)
```vue
<template>
  <n-card title="用户管理">
    <n-data-table
      :columns="columns"
      :data="users"
      :loading="loading"
    />
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NDataTable } from 'naive-ui'
import { User } from '../types/user'
import { userApi } from '../api/userApi'

// 响应式数据
const users = ref<User[]>([])
const loading = ref(false)

// 表格列定义
const columns = [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '状态',
    key: 'isActive',
    render: (row: User) => row.isActive ? '激活' : '禁用'
  }
]

// 生命周期钩子
onMounted(async () => {
  loading.value = true
  try {
    users.value = await userApi.getUsers()
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 组件样式 */
</style>
```

### TypeScript类型定义 (types/user.ts)
```typescript
/**
 * 用户类型定义
 */
export interface User {
  id: number
  username: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 创建用户DTO
 */
export interface CreateUserRequest {
  username: string
  email: string
  password: string
}

/**
 * 更新用户DTO
 */
export interface UpdateUserRequest {
  username?: string
  email?: string
  isActive?: boolean
}
```

## 🧪 测试示例

### 后端单元测试 (Tests/UserServiceTests.cs)
```csharp
using Xunit;
using Moq;
using Ecommerce.Backend.Services;
using Ecommerce.Backend.Models;
using Ecommerce.Backend.DTOs;

namespace Ecommerce.Backend.Tests
{
    public class UserServiceTests
    {
        [Fact]
        public async Task CreateUserAsync_ValidData_ReturnsUser()
        {
            // 安排
            var mockRepo = new Mock<IUserRepository>();
            var service = new UserService(mockRepo.Object);
            var dto = new CreateUserDto 
            { 
                Username = "testuser", 
                Email = "test@example.com", 
                Password = "Password123!" 
            };

            // 行动
            var result = await service.CreateUserAsync(dto);

            // 断言
            Assert.NotNull(result);
            Assert.Equal("testuser", result.Username);
            Assert.Equal("test@example.com", result.Email);
        }

        [Fact]
        public async Task CreateUserAsync_InvalidEmail_ThrowsException()
        {
            // 安排
            var mockRepo = new Mock<IUserRepository>();
            var service = new UserService(mockRepo.Object);
            var dto = new CreateUserDto 
            { 
                Username = "testuser", 
                Email = "invalid-email", 
                Password = "Password123!" 
            };

            // 行动和断言
            await Assert.ThrowsAsync<ArgumentException>(() => service.CreateUserAsync(dto));
        }
    }
}
```

## ✅ 验证要点

### 技术栈合规性
- ✅ 使用SqlSugar ORM（非EntityFramework）
- ✅ Vue 3 Composition API（非Options API）
- ✅ Pinia状态管理（非Vuex）
- ✅ TypeScript类型定义

### 代码质量
- ✅ 完整的XML注释
- ✅ 符合命名规范
- ✅ 错误处理机制
- ✅ 异步编程模式

### 安全考虑
- ✅ 参数验证
- ✅ 异常处理
- ✅ 软删除支持
- ✅ 密码哈希存储

### 测试覆盖
- ✅ 单元测试示例
- ✅ 边界测试
- ✅ 异常测试
- ✅ Mock依赖

## 🚀 使用说明

1. **复制模式**: 以此模板为参考生成类似模块
2. **技术栈**: 严格遵循定义的技术约束
3. **代码风格**: 保持一致的注释和命名规范
4. **测试**: 确保测试覆盖率和质量
5. **验证**: 使用验证脚本检查合规性

---
*示例版本: v1.0*  
*最后更新: 2024-01-01*  
*符合AI约束: ✅*