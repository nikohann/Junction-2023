'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, SliderValue, Select, SelectItem } from "@nextui-org/react";
import { Slider } from "@nextui-org/react";
import { ThemeSwitcher } from "./theme-switcher";
import React, { useContext } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { SettingsContext } from "./chat";
import {Key} from '@react-types/shared';

export default function SettingsModal() {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const settings = useContext(SettingsContext);

    const [temperature, setTemperature] = React.useState<SliderValue>(settings.temp);
    const [maxTokens, setMaxTokens] = React.useState<SliderValue>(settings.maxTokens);
    const [gptModel, setGptModel] = React.useState<Iterable<Key>>(["gpt-3.5-turbo"]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        settings.gptModel = gptModel as string;
        settings.maxTokens = maxTokens as number;
        settings.temp = temperature as number;
    }

    const models = [
        {
            label: 'GPT-3.5-turbo',
            value: 'gpt-3.5-turbo'
        },
        {
            label: 'GPT-3.5',
            value: 'gpt-3.5'
        },
        {
            label: 'GPT-4',
            value: 'gpt-4'
        }
    ];

    return (
        <>
            <Button
                isIconOnly
                onPress={onOpen}
                size="sm"
                color="primary"
                className='absolute -left-10 p-1 h-full'>
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
                                    maxValue={8000}
                                    minValue={0}
                                    value={maxTokens}
                                    onChange={setMaxTokens}
                                    defaultValue={200}
                                    className="max-w-md"
                                />
                                <Select
                                    label="Select GPT Model"
                                    placeholder="GPT Model"
                                    className="max-w-xs"
                                    defaultSelectedKeys={gptModel}
                                    onSelectionChange={setGptModel}
                                >
                                    {models.map((model, i) => (
                                        <SelectItem key={model.value} value={model.value}>
                                            {model.label}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <ThemeSwitcher />

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Discard Changes
                                </Button>
                                <Button color="primary" type="submit" onPress={onClose}>
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
