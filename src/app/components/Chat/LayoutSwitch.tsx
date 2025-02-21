import { cx } from '~/utils'
import { FC, useState } from 'react'
import { Layout } from '~app/consts'
import layoutFourIcon from '~assets/icons/layout-four.svg'
import layoutImageIcon from '~assets/icons/layout-image-input.svg'
import layoutThreeIcon from '~assets/icons/layout-three.svg'
import layoutTwoIcon from '~assets/icons/layout-two.svg'
import layoutTwoHorizonIcon  from '~assets/icons/layout-two-vertical.svg'
import layoutSixIcon from '~assets/icons/layout-six.svg'
import menuIcon from '~assets/icons/menu.svg' // メニューアイコンを追加

const Item: FC<{ icon: string; active: boolean; onClick: () => void }> = (props) => {
  return (
    <a className={cx(!!props.active && 'bg-[#00000014] dark:bg-[#ffffff26] rounded-[6px]')} onClick={props.onClick}>
      <img src={props.icon} className="w-8 h-8 cursor-pointer" />
    </a>
  )
}

interface Props {
  layout: Layout
  onChange: (layout: Layout) => void
}

const LayoutSwitch: FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (layout: Layout) => {
    props.onChange(layout);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2 bg-primary-background rounded-2xl">
      {/* メニューボタン - モバイル表示時のみ */}
      <button
        className="md:hidden bg-primary-background rounded-2xl"
        onClick={togglePanel}
      >
        <img src={menuIcon} className="w-6 h-6" />
      </button>

      {/* レイアウトスイッチパネル */}
      <div
        className={cx(
          'md:relative md:flex',
          'absolute z-50 items-center gap-2',
          !isOpen && 'hidden md:flex px-2', // モバイルでは非表示、デスクトップでは常に表示
          isOpen && 'flex flex-col md:flex-row bottom-full rounded-2xl mb-2 bg-primary-background min-w-[60px] w-max', // モバイルで開いた時は縦並び
        )}
      >
      <Item
        icon={layoutTwoIcon}
        active={props.layout === 2 || props.layout === 'twoVertical'}
          onClick={() => handleItemClick(2)}
      />
      <Item 
        icon={layoutTwoHorizonIcon} 
        active={props.layout === 'twoHorizon'} 
          onClick={() => handleItemClick('twoHorizon')} 
      />
        <Item 
          icon={layoutThreeIcon} 
          active={props.layout === 3} 
          onClick={() => handleItemClick(3)} 
        />
        <Item 
          icon={layoutFourIcon} 
          active={props.layout === 4} 
          onClick={() => handleItemClick(4)} 
        />
        <Item 
          icon={layoutSixIcon} 
          active={props.layout === 'sixGrid'} 
          onClick={() => handleItemClick('sixGrid')} 
        />
      <Item
        icon={layoutImageIcon}
        active={props.layout === 'imageInput'}
          onClick={() => handleItemClick('imageInput')}
      />
      </div>

      {/* オーバーレイ - モバイルでパネルが開いている時のみ表示 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default LayoutSwitch
