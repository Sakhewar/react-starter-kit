

import * as React from "react";

import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export function ConfirmDialog({
  onConfirm,
  title = "Spprimer cet élément ?",
  description = "Êtes-vous sûr de vouloir supprimer cet élément ?",
  confirmText = "Oui, supprimer",
  cancelText = "Annuler",
  open = false,
  onOpenChange
}: {
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText? : string;
  cancelText?: string;
  open: boolean;
  onOpenChange: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-2">
          <Button variant="outline" className="cursor-pointer" onClick={onOpenChange}>{cancelText}</Button>
          <Button
            variant="destructive" className="cursor-pointer"
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}