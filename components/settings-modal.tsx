'use client'

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import {Slider} from "@nextui-org/react";

export default function Settings() {


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <Button
                isIconOnly
                onPress={onOpen}
                size="sm"
                className='absolute top-3 -left-20 bg-gradient-to-tr from-blue-500 to-green-500 text-white shadow-lg'>
                <Cog6ToothIcon />
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <Input type="email" label="Email" placeholder="Enter your email" />
                                <Slider 
                                label="Temperature" 
                                step={0.01} 
                                maxValue={1.0} 
                                minValue={0.0} 
                                defaultValue={0.5}
                                className="max-w-md"
                                />
                                <Slider 
                                label="Max Tokens" 
                                step={1} 
                                maxValue={1024} 
                                minValue={0} 
                                defaultValue={500}
                                className="max-w-md"
                                />
                                <p>
                                    Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                                    dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                                    Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                                    Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}