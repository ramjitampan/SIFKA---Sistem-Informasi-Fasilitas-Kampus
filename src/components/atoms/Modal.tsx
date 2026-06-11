import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { CardHeader } from './Card';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content 
                    className={`fixed left-[50%] top-[50%] z-50 w-full ${sizeClasses[size]} translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`}
                >
                    <div className="flex flex-col h-full">
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                                {title}
                            </Dialog.Title>
                            <Dialog.Description className="sr-only">
                                {title} dialog
                            </Dialog.Description>
                            <Dialog.Close asChild>
                                <button className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <X size={20} />
                                    <span className="sr-only">Close</span>
                                </button>
                            </Dialog.Close>
                        </CardHeader>
                        
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            {children}
                        </div>

                        {footer && (
                            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end space-x-3 rounded-b-xl">
                                {footer}
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
