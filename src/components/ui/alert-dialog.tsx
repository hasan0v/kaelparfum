"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const AlertDialog = Dialog
const AlertDialogTrigger = DialogTrigger
const AlertDialogPortal = ({ ...props }: React.ComponentProps<typeof Dialog>) => null // Not really needed if reusing Dialog

const AlertDialogContent = React.forwardRef<
    React.ElementRef<typeof DialogContent>,
    React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, ...props }, ref) => (
    <DialogContent
        ref={ref}
        showCloseButton={false}
        className={cn("sm:max-w-[425px]", className)}
        {...props}
    />
))
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <DialogHeader className={cn("sm:text-left", className)} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <DialogFooter className={cn("sm:space-x-2", className)} {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogTitle>,
    React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => (
    <DialogTitle ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogDescription>,
    React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => (
    <DialogDescription ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<
    React.ElementRef<typeof Button>,
    React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
    <Button ref={ref} className={cn(className)} {...props} />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
    React.ElementRef<typeof Button>,
    React.ComponentPropsWithoutRef<typeof Button> & { asChild?: boolean }
>(({ className, variant = "outline", asChild = false, ...props }, ref) => {
    // We can't easily access DialogClose primitive here without importing it from primitive or dialog.tsx if exported
    // Fortunately it IS exported from dialog.tsx
    // However, the interface expects an onClick or just acting as a button.
    // In strict AlertDialog, Cancel acts as a Close.
    // Let's import DialogClose from dialog.tsx
    // But wait, my previous view_file of dialog.tsx showed DialogClose IS exported.

    return (
        <DialogClose asChild>
            <Button variant={variant} className={cn("mt-2 sm:mt-0", className)} ref={ref} {...props} />
        </DialogClose>
    )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

// Need to import DialogClose
import { DialogClose } from "@/components/ui/dialog"

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay, // Not used but good to have if needed, can map to DialogOverlay or just omit
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
}

// Defining Overlay just in case
const AlertDialogOverlay = React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
    <div ref={ref} {...props} />
))
AlertDialogOverlay.displayName = "AlertDialogOverlay"
