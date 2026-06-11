import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import Input from '../atoms/Input';

const COMMON_ICONS = [
  'map-pin', 'wrench', 'hammer', 'building', 'alert-triangle', 'info', 'check-circle',
  'x-circle', 'shield', 'settings', 'clipboard', 'user', 'zap', 'droplet', 'trash-2',
  'edit', 'plus', 'search', 'chevron-left', 'chevron-right', 'tag', 'calendar', 'mail',
  'phone', 'printer', 'lock', 'unlock', 'box', 'package'
];

interface IconPickerProps {
    selectedIcon: string;
    onChange: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = COMMON_ICONS.filter(icon => 
        icon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toPascalCase = (str: string) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

    return (
        <div className="space-y-2">
            <Input
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
            />
            <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                {filteredIcons.map(iconName => {
                    const IconComponent = (Icons as any)[toPascalCase(iconName)];
                    if (!IconComponent) return null;
                    
                    const isSelected = selectedIcon === iconName;
                    
                    return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => onChange(iconName)}
                            className={`p-2 rounded flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/50 ${isSelected ? 'bg-indigo-100 dark:bg-indigo-800 ring-2 ring-indigo-500' : ''}`}
                            title={iconName}
                        >
                            <IconComponent size={20} className={isSelected ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default IconPicker;
