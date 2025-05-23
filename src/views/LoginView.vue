<script setup lang="ts">
// 导入vue相关API
import { ref } from 'vue'
// 导入路由
import { useRouter } from 'vue-router'
const router = useRouter()
// 导入网络请求API 
import { postLogin, postSendVerificationCode, postRegister } from '@/services/apis/login'
// 导入仓库
import { useUserStore } from '@/stores/user'
const { _setToken } = useUserStore()
// 导入ElementPlus组件
import { ElMessage } from 'element-plus'
// 用户名
const username = ref('')
// 密码
const password = ref('')
// 邮箱
const email = ref('')
// 验证码
const verificationCode = ref('')
// 验证码剩余时间
const restTime = ref(0)
// 是否需要等待重新发送验证码
const isNeedWait = ref(false)
/**
 * 登录
 */
const handleLogin = async () => {
    if (!username.value || !password.value) {
        ElMessage.error('请输入用户名和密码')
    }
    const res = await postLogin(username.value, password.value)
    if (res.data.code === 200) {
        _setToken(res.data.token)
        router.push('/')
    }
}
// 页面状态
const nowType = ref('login')
/**
 * 切换页面状态: 注册 | 登录
 */
const handleChangeNowType = async () => {
    nowType.value = nowType.value === 'login' ? 'signUp' : 'login'
}
/**
 * 注册
 */
const handleSignUp = async () => {
    if (!username.value) {
        return ElMessage.error('请输入用户名')
    }
    if (!password.value) {
        return ElMessage.error('请输入密码')
    }
    if (!email.value) {
        return ElMessage.error('请输入邮箱')
    }
    if (!verificationCode.value) {
        return ElMessage.error('请输入验证码')
    }
    try {
        const res = await postRegister(username.value, password.value, email.value, verificationCode.value)
        if (res.data.code === 200) {
            ElMessage.success('注册成功')
            handleChangeNowType()
        } else {
            ElMessage.error(res.data.message)
        }
    } catch (err) {
        ElMessage.error(`注册失败${err}`)
    }
}
/**
 * 发送验证码
 */
const handleSendVerificationCode = async () => {
    if (!email.value) {
        ElMessage.error('请输入邮箱')
        return
    }
    try {
        const res = await postSendVerificationCode(email.value)
        if (res.data.code === 200) {
            ElMessage.success('发送成功')
            isNeedWait.value = true
            restTime.value = 60
            let timer = setInterval(() => {
                restTime.value--
                if (restTime.value <= 0) {
                    clearInterval(timer)
                    isNeedWait.value = false
                }
            }, 1000)
        } else {
            ElMessage.error(res.data.message)
        }
    } catch (err) {
        ElMessage.error(`发送验证码失败${err}`)
    }
}
</script>

<template>
    <div class="login-container">
        <!-- 登录 -->
        <div class="login-card" v-if="nowType === 'login'">
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
                    <button @click.prevent="handleChangeNowType" class="btn btn-secondary">去注册</button>
                </div>
            </form>
        </div>
        <!-- 注册 -->
        <div class="login-card" v-else>
            <h2 class="login-title">欢迎注册</h2>
            <p class="login-subtitle">请输入您的账号</p>
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
                <div class="input-group">
                    <label class="input-label">
                        <span class="label-text">邮箱</span>
                        <span class="required-mark">*</span>
                    </label>
                    <input type="text" placeholder="请输入邮箱" v-model="email" class="input-field">
                </div>
                <div class="input-group verification-group">
                    <label class="input-label">
                        <span class="label-text">验证码</span>
                        <span class="required-mark">*</span>
                    </label>
                    <div class="verification-wrapper">
                        <input type="text" placeholder="请输入验证码" v-model="verificationCode"
                            class="input-field verification-input">
                        <button @click.prevent="handleSendVerificationCode" v-if="!isNeedWait" class="verification-btn">
                            发送验证码
                        </button>
                        <div v-else class="countdown-timer">
                            <span class="countdown-number">{{ restTime }}</span>
                            <span class="countdown-text">秒后重试</span>
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <button @click.prevent="handleSignUp" class="btn btn-primary">注册</button>
                    <button @click.prevent="handleChangeNowType" class="btn btn-secondary">去登录</button>
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

    .login-card {
        background: white;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 420px;

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

            .input-label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-size: 14px;
                font-weight: 500;

                .label-text {
                    margin-right: 4px;
                }

                .required-mark {
                    color: #ff4d4f;
                    margin-left: 2px;
                }
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

            .input-div {
                display: flex;
                gap: 10px;

                input {
                    flex: 1;
                }

                button {
                    width: auto;
                }
            }
        }

        .button-group {
            display: flex;
            gap: 16px;
            margin-top: 32px;

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
        }

        .verification-group {
            .verification-wrapper {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .verification-input {
                flex: 1;
                min-width: 0; // 防止输入框溢出
            }

            .verification-btn {
                min-width: 120px;
                height: 40px;
                padding: 0 16px;
                background: #409eff;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;

                &:hover {
                    background: #66b1ff;
                    transform: translateY(-1px);
                }

                &:active {
                    transform: translateY(0);
                    background: #3a8ee6;
                }
            }

            .countdown-timer {
                min-width: 120px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f7fa;
                border: 1px solid #e4e7ed;
                border-radius: 8px;
                padding: 0 16px;
                color: #909399;
                font-size: 14px;
                user-select: none;

                .countdown-number {
                    font-weight: 600;
                    color: #409eff;
                    margin-right: 4px;
                }

                .countdown-text {
                    color: #909399;
                }
            }
        }
    }
}
</style>