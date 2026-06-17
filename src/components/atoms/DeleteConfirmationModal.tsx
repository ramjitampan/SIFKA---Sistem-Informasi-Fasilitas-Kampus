import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isDeleting = false,
}) => {
    const { t } = useTranslation('common');
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || t('modal.delete')}
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        {t('modal.cancel')}
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={onConfirm} 
                        isLoading={isDeleting}
                    >
                        {t('modal.delete')}
                    </Button>
                </>
            }
        >
            <p className="text-slate-600 dark:text-slate-400">{description}</p>
        </Modal>
    );
};

export default DeleteConfirmationModal;
