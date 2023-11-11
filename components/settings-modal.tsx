'use client'

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Select, SelectItem, Switch} from "@nextui-org/react";


import {Slider} from "@nextui-org/react";

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
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                
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
                                <Select
                                label="Select Gpt model"
                                placeholder="Gpt Model"
                                selectionMode="multiple"
                                className="max-w-xs"
                                >
                                {['GPT-3', 'GPT-3,5', 'GPT-4'].map((item, i) => (
                                    <SelectItem key={i} value={item}>
                                    {item}
                                    </SelectItem>
                                ))}
                                </Select>
                                <Switch
                                defaultSelected
                                size="lg"
                                color="primary"
                                startContent={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                              </svg>
                               }
                                endContent={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                              </svg>
                              }
                                
                                >
                                Dark mode
                                </Switch>
        
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