'use client'

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Select, SelectItem, Switch} from "@nextui-org/react";


import {Slider} from "@nextui-org/react";
import { ThemeSwitcher } from "./theme-switcher";

export default function Settings() {


    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    
    return (
        <>
            <Button
                isIconOnly
                onPress={onOpen}
                size="sm"
                color="primary"
                className='absolute top-3 -left-20 p-1'>
                <Cog6ToothIcon />
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                            <ModalBody>
                
                                <Slider 
                                label="Temperature" 
                                step={0.1} 
                                maxValue={1.0} 
                                minValue={0.0} 
                                defaultValue={0.5}
                                className="max-w-md"
                                />
                                <Slider 
                                label="Max Tokens" 
                                step={10}
                                maxValue={1024} 
                                minValue={0} 
                                defaultValue={500}
                                className="max-w-md"
                                />
                                <Select
                                label="Select GPT Model"
                                placeholder="GPT Model"
                                selectionMode="single"
                                className="max-w-xs"
                                >
                                {['GPT-3', 'GPT-3.5', 'GPT-4'].map((item, i) => (
                                    <SelectItem key={i} value={item}>
                                    {item}
                                    </SelectItem>
                                ))}
                                </Select>

                                <ThemeSwitcher />
        
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Discard Changes
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}