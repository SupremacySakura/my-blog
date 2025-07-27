import { create } from 'zustand'
import { uploadResource } from 'yxzq-utils-browser'
import { message } from 'antd'
interface UploadResult {
    message: string;
    error?: any;
    filePath: string | null;
    code: number;
}
interface StorageState {
    handleUploadImage: (e: React.ChangeEvent<HTMLInputElement>, config: { fileName?: string, folderName?: string }) => Promise<UploadResult>
}

const useStorageState = create<StorageState>()(
    () => {
        return {
            handleUploadImage: async (e: React.ChangeEvent<HTMLInputElement>, config: { fileName?: string, folderName?: string }) => {
                const file = e.target.files?.[0]
                if (!file) {
                    return {
                        message: '上传失败',
                        error: '未选择文件',
                        filePath: null,
                        code: 500
                    }
                }
                try {
                    message.info('正在上传中...')
                    const res = await uploadResource(file, {
                        fileName: config.fileName || file.name,
                        folderName: config.folderName,
                        url: 'http://super-yxzq-blog.top:3100',
                        useDate: 'yes',
                        ext: 'jpg'
                    })
                    message.success(`上传成功,图片地址为:${res.filePath}`)
                    return res
                } catch (err) {
                    message.error(`${err}`)
                    return {
                        message: '上传失败',
                        error: err,
                        filePath: null,
                        code: 500
                    }
                }
            }
        }

    }
)
export default useStorageState