import React, { useState, useCallback, useImperativeHandle } from "react";

import { Modal } from "../modal";
import { Anchor } from "../anchor";
import { Text } from "../text";
import { statementDiagnostics } from "src/util";

export interface ActivateDiagnosticsModalProps {
  activate: (statement: string) => void;
  refreshDiagnosticsReports: () => void;
  onOpenModal?: (statement: string) => void;
}

export interface ActivateDiagnosticsModalRef {
  showModalFor: (statement: string) => void;
}

export const ActivateStatementDiagnosticsModal = React.forwardRef(
  (
    { activate, onOpenModal }: ActivateDiagnosticsModalProps,
    ref: React.RefObject<ActivateDiagnosticsModalRef>,
  ) => {
    const [visible, setVisible] = useState(false);
    const [statement, setStatement] = useState<string>();

    const onOkHandler = useCallback(() => {
      activate(statement);
      setVisible(false);
    }, [activate, statement]);

    const onCancelHandler = useCallback(() => setVisible(false), []);

    useImperativeHandle(ref, () => {
      return {
        showModalFor: (forwardStatement: string) => {
          setStatement(forwardStatement);
          setVisible(true);
          onOpenModal && onOpenModal(forwardStatement);
        },
      };
    });

    return (
      <Modal
        visible={visible}
        onOk={onOkHandler}
        onCancel={onCancelHandler}
        okText="Activate"
        cancelText="Cancel"
        title="Activate statement diagnostics"
      >
        <Text>
          When you activate statement diagnostics, CockroachDB will wait for the
          next query that matches this statement fingerprint.
        </Text>
        <p />
        <Text>
          A download button will appear on the statement list and detail pages
          when the query is ready. The download will include EXPLAIN plans,
          table statistics, and traces.{" "}
          <Anchor href={statementDiagnostics}>Learn more</Anchor>
        </Text>
      </Modal>
    );
  },
);
