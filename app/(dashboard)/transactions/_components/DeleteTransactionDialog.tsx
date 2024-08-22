"use client";

import React from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

function DeleteTransactionDialog({ open, setOpen, transactionId }: Props) {
  return <div></div>;
}

export default DeleteTransactionDialog;
