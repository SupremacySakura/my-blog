import ArticleTable from '@/components/business/ArticleTable'
import TagTable from '@/components/business/TagTable'
import SwitchPanel, { INavItem } from '@/components/my-ui/SwitchPanel'

enum Mode {
  Article = 'article',
  Tag = 'tag',
}

export default function Page() {
  // 导航项配置
  const navItems: INavItem[] = [
    { key: Mode.Article, label: '文章', component: <ArticleTable /> },
    { key: Mode.Tag, label: '标签', component: <TagTable /> },
  ]

  return (
    <>
      <SwitchPanel navItems={navItems} />
    </>
  )
}
