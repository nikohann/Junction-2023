'use client'

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, SliderValue, Select, SelectItem } from "@nextui-org/react";
import { Slider } from "@nextui-org/react";
import { ThemeSwitcher } from "./theme-switcher";
import React from "react";

interface Settings {
    temp: number,
    max_tokens: number,
    gpt_model: string,
}

export default function SettingsModal({ temp, max_tokens, gpt_model }: Settings) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [temperature, setTemperature] = React.useState<SliderValue>(temp);
    const [maxTokens, setMaxTokens] = React.useState<SliderValue>(max_tokens);
    const [gptModel, setGptModel] = React.useState<string>("gpt-3.5-turbo");

    console.log("asdasdasd")
    console.log(temp, max_tokens, gpt_model)

    //print states:
    React.useEffect(() => {
        console.log(temperature, maxTokens, gptModel)
    }, [temperature, maxTokens, gptModel])

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGptModel(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("handleSave");
    }

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
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                            <ModalBody>
                                <Slider
                                    label="Temperature"
                                    step={0.1}
                                    maxValue={1.0}
                                    minValue={0.0}
                                    value={temperature}
                                    onChange={setTemperature}
                                    defaultValue={0.5}
                                    className="max-w-md"
                                />
                                <Slider
                                    label="Max Tokens"
                                    step={10}
                                    maxValue={1024}
                                    minValue={0}
                                    value={maxTokens}
                                    onChange={setMaxTokens}
                                    defaultValue={500}
                                    className="max-w-md"
                                />
                                <Select
                                    label="Select GPT Model"
                                    placeholder="GPT Model"
                                    className="max-w-xs"
                                    onChange={handleSelectionChange}
                                    selectedKeys={gptModel}
                                >
                                    {['GPT-3.5-turbo', 'GPT-3.5', 'GPT-4'].map((item, i) => (
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
                                <Button color="primary" type="submit">
                                    Save
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}