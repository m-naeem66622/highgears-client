import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { CustomButton } from "./CustomButton";

const ConfirmationModal = ({
  onConfirm,
  isOpen,
  onOpenChange,
  children,
  rolling = false,
  title = "Modal Title",
}) => {
  const confirmHandle = (_id) => {
    onConfirm(_id).then(() => {
      onOpenChange();
    });
  };

  return (
    <Modal
      backdrop="blur"
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      radius="none"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <CustomButton
                color="default"
                radius="none"
                onPress={rolling || onClose}
                disabled={rolling}
              >
                Close
              </CustomButton>
              <CustomButton
                color="danger"
                radius="none"
                onPress={confirmHandle}
                isLoading={rolling}
              >
                Confirm
              </CustomButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
