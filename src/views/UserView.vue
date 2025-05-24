<script setup lang="ts">
// 导入vue相关api
import { ref } from 'vue'
// 导入仓库
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
const { _user } = storeToRefs(useUserStore())
// 导入请求api
import { postAvatar } from '@/services/apis/user'
import { refreshToken } from '@/services/apis/login'
// 导入ElmentPlus相关组件
import { ElMessage } from 'element-plus'
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
                            <div class="info-value">{{ _user?.username }}</div>
                        </div>

                        <div class="info-group">
                            <label class="info-label">邮箱地址</label>
                            <div class="info-value">{{ _user?.email }}</div>
                        </div>

                        <div class="info-group">
                            <label class="info-label">所在地</label>
                            <div class="info-value">{{ _user?.address || '未设置' }}</div>
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
            }
        }
    }
}
</style>