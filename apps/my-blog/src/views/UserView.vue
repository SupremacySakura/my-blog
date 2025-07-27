<script setup lang="ts">
// 导入vue相关api
import { ref, useTemplateRef, nextTick } from 'vue'
// 导入仓库
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
const { _user } = storeToRefs(useUserStore())
// 导入请求api
import { postAvatar, postUsername, postEmail, postAddress } from '@/services/apis/user'
import { refreshToken } from '@/services/apis/login'
// 导入ElmentPlus相关组件
import { ElMessage } from 'element-plus'
// 导入路由
import { useRouter } from 'vue-router'
const router = useRouter()
// 头像
const avatar = ref<File | null>(null)
// 更新头像
const setAvatar = async (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        avatar.value = input.files[0]
    } else {
        avatar.value = null
    }
    if (avatar.value) {
        if (_user.value && _user.value.uid) {
            const formData = new FormData()
            formData.set('uid', _user.value.uid.toString())
            formData.set('avatar', avatar.value)
            try {
                const res = await postAvatar(formData)
                if (res.data.code === 200) {
                    await refreshToken()
                    return ElMessage.success(res.data.message)
                } else {
                    return ElMessage.error(`更新失败,${res.data.messgae}`)
                }
            } catch (err) {
                return ElMessage.error(`更新失败,${err}`)
            }
        } else {
            return ElMessage.error('请先登录')
        }
    }
    ElMessage.error('请选择文件')
}
// 可选状态
enum eChangeStatus {
    USERNAME = 'username',
    EMAIL = 'email',
    ADDRESS = 'address'
}
// dom
const usernameBox = useTemplateRef('username-box')
const emailBox = useTemplateRef('email-box')
const addressBox = useTemplateRef('address-box')
// 更改状态
const handleChangeStatus = (changeStatus: eChangeStatus) => {
    switch (changeStatus) {
        case eChangeStatus.USERNAME:
            changeUsernameStatus.value = !changeUsernameStatus.value
            if (changeUsernameStatus.value) {
                nextTick(() => {
                    usernameBox.value?.focus()
                })
            }
            break
        case eChangeStatus.EMAIL:
            changeEmailStatus.value = !changeEmailStatus.value
            if (changeEmailStatus.value) {
                nextTick(() => {
                    emailBox.value?.focus()
                })
            }
            break
        case eChangeStatus.ADDRESS:
            changeAddressStatus.value = !changeAddressStatus.value
            if (changeAddressStatus.value) {
                nextTick(() => {
                    addressBox.value?.focus()
                })
            }
            break
    }
}
// 用户名
const username = ref(_user.value?.username || '')
const changeUsernameStatus = ref(false)
// 上传名字
const handleChangeUsername = async () => {
    if (username.value === _user.value?.username) {
        handleChangeStatus(eChangeStatus.USERNAME)
        return
    }
    const uid = _user.value?.uid
    if (!uid) {
        ElMessage.error('请先登录')
        router.push('/login')
        return
    }
    try {
        const res = await postUsername(uid, username.value)
        if (res.data.code === 200) {
            await refreshToken()
            ElMessage.success('更改成功')
        } else {
            ElMessage.error(`更新失败,${res.data.message}`)
        }
    } catch (err) {
        ElMessage.error(`更新失败,${err}`)
    } finally {
        handleChangeStatus(eChangeStatus.USERNAME)
    }
}
// 邮箱地址
const email = ref(_user.value?.email || '')
const changeEmailStatus = ref(false)
// 上传邮箱
const handleChangeEmail = async () => {
    if (email.value === _user.value?.email) {
        handleChangeStatus(eChangeStatus.EMAIL)
        return
    }
    const uid = _user.value?.uid
    if (!uid) {
        ElMessage.error('请先登录')
        router.push('/login')
        return
    }
    try {
        const res = await postEmail(uid, email.value)
        if (res.data.code === 200) {
            await refreshToken()
            ElMessage.success('更改成功')
        } else {
            ElMessage.error(`更新失败,${res.data.message}`)
        }
    } catch (err) {
        ElMessage.error(`更新失败,${err}`)
    } finally {
        handleChangeStatus(eChangeStatus.EMAIL)
    }
}
// 地址
const address = ref(_user.value?.address || '')
const changeAddressStatus = ref(false)
// 上传地址
const handleChangeAddress = async () => {
    if (address.value === _user.value?.address) {
        handleChangeStatus(eChangeStatus.ADDRESS)
        return
    }
    const uid = _user.value?.uid
    if (!uid) {
        ElMessage.error('请先登录')
        router.push('/login')
        return
    }
    try {
        const res = await postAddress(uid, address.value)
        if (res.data.code === 200) {
            await refreshToken()
            ElMessage.success('更改成功')
        } else {
            ElMessage.error(`更新失败,${res.data.message}`)
        }
    } catch (err) {
        ElMessage.error(`更新失败,${err}`)
    } finally {
        handleChangeStatus(eChangeStatus.ADDRESS)
    }
}
</script>

<template>
    <div class="user-box">
        <div class="user-profile-container">
            <div class="profile-header">
                <h1 class="profile-title">个人信息</h1>
                <p class="profile-subtitle">管理您的个人资料和账户设置</p>
            </div>

            <div class="profile-content">
                <div class="profile-card">
                    <div class="avatar-section">
                        <div class="avatar-wrapper">
                            <el-image :src="_user?.avatar" class="avatar-image" fit="cover">
                                <template #error>
                                    <div class="avatar-placeholder">
                                        {{ _user?.username?.charAt(0)?.toUpperCase() }}
                                    </div>
                                </template>
                            </el-image>
                            <div class="avatar-upload">
                                <input type="file" id="uploadAvatar" accept="image/*" class="avatar-input"
                                    @change="(e) => setAvatar(e)">
                                <label for="uploadAvatar" class="upload-button">
                                    <i class="el-icon-camera"></i>
                                    <span>更换头像</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="info-section">
                        <div class="info-group">
                            <label class="info-label">用户ID</label>
                            <div class="info-value">{{ _user?.uid }}</div>
                        </div>

                        <div class="info-group">
                            <label class="info-label">用户名</label>
                            <div>
                                <div class="info-value" v-show="!changeUsernameStatus"
                                    @click="handleChangeStatus(eChangeStatus.USERNAME)">
                                    {{ _user?.username }}
                                </div>
                                <input type="text" v-show="changeUsernameStatus" v-model="username"
                                    @blur="handleChangeUsername()" ref="username-box">
                            </div>
                        </div>

                        <div class="info-group">
                            <label class="info-label">邮箱地址</label>
                            <div>
                                <div class="info-value" v-show="!changeEmailStatus"
                                    @click="handleChangeStatus(eChangeStatus.EMAIL)">
                                    {{ _user?.email }}</div>
                                <input type="text" v-show="changeEmailStatus" v-model="email"
                                    @blur="handleChangeEmail()" ref="email-box">
                            </div>

                        </div>

                        <div class="info-group">
                            <label class="info-label">所在地</label>
                            <div>
                                <div class="info-value" v-show="!changeAddressStatus"
                                    @click="handleChangeStatus(eChangeStatus.ADDRESS)">
                                    {{ _user?.address || '未设置' }}</div>
                                <input type="text" v-show="changeAddressStatus" v-model="address"
                                    @blur="handleChangeAddress()" ref="address-box">
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style lang="less" scoped>
.user-box {
    .standardBox();
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #f7f9fb;

    .user-profile-container {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        padding: 40px 32px 32px 32px;
        min-width: 340px;
        max-width: 500px;
        width: 500px;
        margin: 48px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .profile-header {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .profile-content {
            width: 100%;

            .avatar-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 32px;

                .avatar-image {
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    border: 4px solid #e6eaf0;
                    object-fit: cover;
                    box-shadow: 0 2px 12px rgba(64, 158, 255, 0.08);
                    margin-bottom: 12px;
                    background: #f0f4fa;
                    transition: box-shadow 0.3s, border-color 0.3s;

                    &:hover {
                        box-shadow: 0 6px 24px rgba(64, 158, 255, 0.18);
                        border-color: #409eff;
                    }
                }

                .avatar-placeholder {
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    background: #e6eaf0;
                    color: #409eff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    font-weight: bold;
                    margin-bottom: 12px;
                }

                .avatar-upload {
                    .avatar-input {
                        display: none;
                    }

                    .upload-button {
                        background: #f5f7fa;
                        color: #409eff;
                        border: 1px solid #dbeafe;
                        border-radius: 6px;
                        padding: 6px 18px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.2s, color 0.2s, border 0.2s;
                        margin-top: 4px;
                        display: block;
                        text-align: center;

                        &:hover {
                            background: #409eff;
                            color: #fff;
                            border-color: #409eff;
                        }
                    }
                }
            }

            .info-section {
                width: 100%;

                .info-group {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 0;
                    border-bottom: 1px solid #f0f1f3;

                    &:last-child {
                        border-bottom: none;
                    }

                    .info-label {
                        color: #8a97a8;
                        font-size: 15px;
                        font-weight: 500;
                    }

                    .info-value {
                        color: #222;
                        font-size: 15px;
                        font-weight: 400;
                        word-break: break-all;
                    }

                    input[type="text"] {
                        width: 220px;
                        padding: 7px 14px;
                        font-size: 15px;
                        border: 1.5px solid #e6eaf0;
                        border-radius: 6px;
                        outline: none;
                        background: #f7f9fb;
                        color: #222;
                        transition: border-color 0.2s, box-shadow 0.2s;
                        margin-left: 0;
                        box-sizing: border-box;
                        box-shadow: none;

                        &:focus {
                            border-color: #409eff;
                            background: #fff;
                            box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
                        }
                    }
                }
            }
        }

        .profile-actions {
            margin-top: 32px;
            width: 100%;
            display: flex;
            justify-content: flex-end;

            .action-btn {
                background: #409eff;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 8px 22px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s, box-shadow 0.2s;
                box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);

                &:hover {
                    background: #337ecc;
                    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.18);
                }
            }
        }
    }
}

@media (max-width: 500px) {
    .user-box {
        .user-profile-container {
            padding: 24px 8px 16px 8px;
            min-width: unset;
            max-width: 98vw;
            width: 100%;
        }

        .info-section {
            .info-group {
                flex-direction: column;
                align-items: flex-start;
                gap: 2px;

                .info-label {
                    font-size: 14px;
                }

                .info-value {
                    font-size: 14px;
                }

                input[type="text"] {
                    width: 100%;
                    min-width: 0;
                }
            }
        }
    }
}
</style>