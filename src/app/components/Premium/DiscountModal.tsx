import { FC } from 'react'
import Dialog from '../Dialog'
import { useAtom } from 'jotai'
import { showDiscountModalAtom } from '~app/state'
import Button from '../Button'

const DiscountModal: FC = () => {
  const [open, setOpen] = useAtom(showDiscountModalAtom)
  return (
    <Dialog title="" open={open} onClose={() => setOpen(false)} className="min-w-[600px] p-10">
      <div className="flex flex-col items-center">
        <div className="">hello world</div>
        <Button text="Get Discount" color="primary" />
      </div>
    </Dialog>
  )
}

export default DiscountModal
