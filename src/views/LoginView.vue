<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postLogin, getJWT } from '@/services/apis/login'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
const { _setToken } = useUserStore()
const username = ref('')
const password = ref('')
const router = useRouter()
const handleLogin = async () => {
    // console.log(username.value, password.value)
    if (!username.value || !password.value) {
        ElMessage.error('请输入用户名和密码')
    }
    const res = await postLogin(username.value, password.value)
    if (res.data.code === 200) {
        _setToken(res.data.token)
        router.push('/')
    }
}
const handleSignUp = async () => {
    const res = await getJWT()
    console.log(res)
}
</script>
<template>
    <div class="login-container">
        <div class="login-card">
            <h2 class="login-title">欢迎登录</h2>
            <p class="login-subtitle">请登录您的账号</p>
            <form action="">
                <div class="input-group">
                    <label class="input-label">
                        <span class="label-text">用户名</span>
                        <span class="required-mark">*</span>
                    </label>
                    <input type="text" placeholder="请输入用户名" v-model="username" class="input-field">
                </div>
                <div class="input-group">
                    <label class="input-label">
                        <span class="label-text">密码</span>
                        <span class="required-mark">*</span>
                    </label>
                    <input type="password" placeholder="请输入密码" v-model="password" class="input-field">
                </div>

                <div class="button-group">
                    <button @click.prevent="handleLogin" class="btn btn-primary">登录</button>
                    <button @click.prevent="handleSignUp" class="btn btn-secondary">注册</button>
                </div>
            </form>
        </div>
    </div>
</template>
<style lang="less" scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
}

.login-card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 420px;
}

.login-title {
    font-size: 28px;
    color: #333;
    margin: 0 0 8px;
    text-align: center;
    font-weight: 600;
}

.login-subtitle {
    color: #666;
    text-align: center;
    margin-bottom: 32px;
    font-size: 14px;
}

.input-group {
    margin-bottom: 24px;
}

.input-label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
}

.label-text {
    margin-right: 4px;
}

.required-mark {
    color: #ff4d4f;
    margin-left: 2px;
}

.input-field {
    width: 100%;
    height: 40px;
    padding: 0 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: #fafafa;
    box-sizing: border-box;
    &:focus {
        outline: none;
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        background: white;
    }

    &::placeholder {
        color: #999;
    }
}

.button-group {
    display: flex;
    gap: 16px;
    margin-top: 32px;
}

.btn {
    flex: 1;
    height: 40px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
}

.btn-primary {
    background: #409eff;
    color: white;

    &:hover {
        background: #66b1ff;
    }
}

.btn-secondary {
    background: #f5f7fa;
    color: #606266;
    border: 1px solid #dcdfe6;

    &:hover {
        background: #e6e8eb;
        border-color: #c0c4cc;
    }
}
</style>