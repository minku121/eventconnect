import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out dark:bg-opacity-75">
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out dark:bg-[#101010]">
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700 transition-colors duration-200 dark:text-gray-300 dark:hover:text-gray-500"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
