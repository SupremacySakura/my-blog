import style from './index.module.css'
export default function Loading() {
    return (
        <div className='flex justify-center items-center h-screen'>   
            <div className={style.loader}></div>
        </div>
    )
}
