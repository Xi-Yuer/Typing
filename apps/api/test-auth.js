const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// 测试数据
const testUsers = {
  admin: {
    name: 'admin_user',
    email: 'admin@test.com',
    password: 'password123'
  },
  user: {
    name: 'normal_user', 
    email: 'user@test.com',
    password: 'password123'
  }
};

let tokens = {};

// 辅助函数：发送请求
async function makeRequest(method, url, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {}
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// 1. 注册测试用户
async function registerUsers() {
  console.log('\n=== 注册测试用户 ===');
  
  for (const [role, userData] of Object.entries(testUsers)) {
    console.log(`\n注册 ${role} 用户:`);
    const result = await makeRequest('POST', '/auth/register', userData);
    
    if (result.success) {
      // 处理统一响应格式
      const accessToken = result.data.data?.accessToken || result.data.accessToken;
      tokens[role] = accessToken;
      console.log(`✅ ${role} 用户注册成功`);
      console.log(`Token: ${accessToken ? accessToken.substring(0, 20) + '...' : 'N/A'}`);
      console.log(`Response:`, JSON.stringify(result.data, null, 2));
    } else {
      console.log(`❌ ${role} 用户注册失败:`, result.error);
    }
  }
}

// 2. 测试登录
async function testLogin() {
  console.log('\n=== 测试登录 ===');
  
  for (const [role, userData] of Object.entries(testUsers)) {
    console.log(`\n${role} 用户登录:`);
    const result = await makeRequest('POST', '/auth/login', {
      email: userData.email,
      password: userData.password
    });
    
    if (result.success) {
      // 处理统一响应格式
      const accessToken = result.data.data?.accessToken || result.data.accessToken;
      tokens[role] = accessToken;
      console.log(`✅ ${role} 用户登录成功`);
      console.log(`Token: ${accessToken ? accessToken.substring(0, 20) + '...' : 'N/A'}`);
    } else {
      console.log(`❌ ${role} 用户登录失败:`, result.error);
    }
  }
}

// 3. 测试获取当前用户信息（所有用户都应该能访问）
async function testGetProfile() {
  console.log('\n=== 测试获取用户信息 (/user/me) ===');
  
  for (const [role, token] of Object.entries(tokens)) {
    console.log(`\n${role} 用户访问 /user/me:`);
    const result = await makeRequest('GET', '/user/me', null, token);
    
    if (result.success) {
      console.log(`✅ ${role} 用户成功获取个人信息`);
      console.log(`用户信息:`, {
        id: result.data.data.id,
        name: result.data.data.name,
        email: result.data.data.email,
        role: result.data.data.role,
        status: result.data.data.status
      });
    } else {
      console.log(`❌ ${role} 用户获取个人信息失败:`, result.error);
    }
  }
}

// 4. 测试分页查询用户（仅管理员应该能访问）
async function testGetUsers() {
  console.log('\n=== 测试分页查询用户 (/user/paginated) - 仅管理员 ===');
  
  for (const [role, token] of Object.entries(tokens)) {
    console.log(`\n${role} 用户访问 /user/paginated:`);
    const result = await makeRequest('GET', '/user/paginated?page=1&pageSize=10', null, token);
    
    if (result.success) {
      console.log(`✅ ${role} 用户成功获取用户列表`);
      console.log(`用户数量: ${result.data.data.items.length}`);
    } else {
      console.log(`❌ ${role} 用户获取用户列表失败:`, result.error);
      console.log(`状态码: ${result.status}`);
    }
  }
}

// 5. 测试创建用户（仅管理员应该能访问）
async function testCreateUser() {
  console.log('\n=== 测试创建用户 (/user) - 仅管理员 ===');
  
  const newUser = {
    name: 'test_created_user',
    email: 'created@test.com',
    password: 'password123'
  };
  
  for (const [role, token] of Object.entries(tokens)) {
    console.log(`\n${role} 用户尝试创建新用户:`);
    const result = await makeRequest('POST', '/user', newUser, token);
    
    if (result.success) {
      console.log(`✅ ${role} 用户成功创建用户`);
      console.log(`新用户ID: ${result.data.data.id}`);
    } else {
      console.log(`❌ ${role} 用户创建用户失败:`, result.error);
      console.log(`状态码: ${result.status}`);
    }
  }
}

// 6. 测试无token访问
async function testNoAuth() {
  console.log('\n=== 测试无认证访问 ===');
  
  const endpoints = [
    '/user/me',
    '/user/paginated',
    '/user'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n无token访问 ${endpoint}:`);
    const result = await makeRequest('GET', endpoint);
    
    if (result.success) {
      console.log(`✅ 无认证访问成功（这可能是个问题）`);
    } else {
      console.log(`❌ 无认证访问被拒绝 (${result.status}):`, result.error.message || result.error);
    }
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始角色权限控制测试\n');
  
  try {
    await registerUsers();
    await testLogin();
    await testGetProfile();
    await testGetUsers();
    await testCreateUser();
    await testNoAuth();
    
    console.log('\n✅ 所有测试完成！');
    console.log('\n📋 测试总结:');
    console.log('1. 普通用户应该只能访问 /user/me');
    console.log('2. 管理员用户应该能访问所有接口');
    console.log('3. 无认证用户应该被拒绝访问所有受保护的接口');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
runTests();