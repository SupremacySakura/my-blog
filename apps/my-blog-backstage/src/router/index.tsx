import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "@/App"
import Main from "@/views/Main/Main"
import Home from "@/views/HomePage/Home"
import Share from "@/views/SharePage/Share"
import Article from "@/views/ArticlePage/Article"
import Message from "@/views/MessagePage/Message"
import Friend from "@/views/FriendPage/Friend"
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Navigate to='/main/home' replace />
            },
            {
                path: 'main',
                element: <Main />,
                children: [
                    {
                        path: 'home',
                        element: <Home />
                    },
                    {
                        path: 'share',
                        element: <Share />
                    },
                    {
                        path: 'article',
                        element: <Article />
                    },
                    {
                        path: 'message',
                        element: <Message />
                    },
                    {
                        path: 'friend',
                        element: <Friend />
                    }
                ]
            },
            {
                path: '*',
                element: <Navigate to='/main/home' replace />
            }
        ]
    }
])

export default router