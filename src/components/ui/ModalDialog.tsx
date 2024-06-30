import cx from "classnames";
import {
  Dialog,
  DialogProps,
  Modal,
  ModalOverlay,
} from "react-aria-components";

const OVERLAY_CLASSNAME = cx(
  "fixed top-0 left-0 w-full h-[--visual-viewport-height] isolate z-20",
  "bg-black/[60%] flex items-center justify-center p-4 text-center",
);

const MODAL_CLASSNAME = cx(
  "w-full max-w-2xl max-h-full rounded-2xl bg-white overflow-auto text-left align-middle shadow rounded",
);

export function ModalDialog({ className, ...props }: DialogProps) {
  return (
    <ModalOverlay className={OVERLAY_CLASSNAME}>
      <Modal className={MODAL_CLASSNAME}>
        <Dialog
          {...props}
          className={cx(
            "outline outline-0 [[data-placement]>&]:p-4 max-h-[inherit] relative",
            className,
          )}
        />
      </Modal>
    </ModalOverlay>
  );
}
