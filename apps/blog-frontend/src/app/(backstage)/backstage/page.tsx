import ColorTable from '@/components/business/ColorTable'
import LabelTable from '@/components/business/LabelTable'
import SayingTable from '@/components/business/SayingTable'
import TechnologyTable from '@/components/business/TechnologyTable'
import SwitchPanel, { INavItem } from '@/components/my-ui/SwitchPanel'

enum Mode {
  Technology = 'technology',
  Color = 'color',
  Tag = 'tag',
  Saying = 'saying',
}

export default function Page() {
  // 导航项配置
  const navItems: INavItem[] = [
    { key: Mode.Technology, label: '技术栈', component: <TechnologyTable /> },
    { key: Mode.Color, label: '颜色', component: <ColorTable /> },
    { key: Mode.Tag, label: '标签', component: <LabelTable /> },
    { key: Mode.Saying, label: '名言', component: <SayingTable /> },
  ]

  return (
    <>
      <SwitchPanel navItems={navItems} />
    </>
  )
}
