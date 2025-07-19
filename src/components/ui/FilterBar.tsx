import React from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import Badge from "./Badge";

// Filter option types
export type FilterType = "select" | "multiselect" | "toggle" | "range";

export interface FilterOption {
    key: string;
    label: string;
    type: FilterType;
    options?: Array<{ value: string; label: string; count?: number }>;
    placeholder?: string;
    defaultValue?: any;
}

// FilterBar Props
export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Filter configuration */
    filters: FilterOption[];
    /** Active filter values */
    activeFilters: Record<string, any>;
    /** Filter change handler */
    onFilterChange: (filters: Record<string, any>) => void;
    /** Reset filters handler */
    onReset?: () => void;
    /** Whether to show reset button */
    showReset?: boolean;
    /** Whether to show active filter count */
    showCount?: boolean;
    /** Custom class name */
    className?: string;
}

// Individual filter components
const SelectFilter: React.FC<{
    filter: FilterOption;
    value: string;
    onChange: (value: string) => void;
}> = ({ filter, value, onChange }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">
            {filter.label}
        </label>
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                "px-3 py-2 text-sm border border-input rounded-md",
                "bg-background text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "disabled:cursor-not-allowed disabled:opacity-50"
            )}
        >
            <option value="">{filter.placeholder || `All ${filter.label}`}</option>
            {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                    {option.count !== undefined && ` (${option.count})`}
                </option>
            ))}
        </select>
    </div>
);

const MultiSelectFilter: React.FC<{
    filter: FilterOption;
    value: string[];
    onChange: (value: string[]) => void;
}> = ({ filter, value = [], onChange }) => {
    const toggleOption = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
                {filter.label}
            </label>
            <div className="flex flex-wrap gap-1">
                {filter.options?.map((option) => {
                    const isSelected = value.includes(option.value);
                    return (
                        <Button
                            key={option.value}
                            variant={isSelected ? "primary" : "outline"}
                            size="sm"
                            onClick={() => toggleOption(option.value)}
                            className="h-8 text-xs"
                        >
                            {option.label}
                            {option.count !== undefined && ` (${option.count})`}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

const ToggleFilter: React.FC<{
    filter: FilterOption;
    value: boolean;
    onChange: (value: boolean) => void;
}> = ({ filter, value, onChange }) => (
    <div className="flex items-center gap-2">
        <input
            type="checkbox"
            id={filter.key}
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className={cn(
                "w-4 h-4 text-primary border-input rounded",
                "focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
            )}
        />
        <label
            htmlFor={filter.key}
            className="text-sm font-medium text-foreground cursor-pointer"
        >
            {filter.label}
        </label>
    </div>
);

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
    (
        {
            filters,
            activeFilters,
            onFilterChange,
            onReset,
            showReset = true,
            showCount = true,
            className = "",
            ...props
        },
        ref
    ) => {
        // Count active filters
        const activeFilterCount = Object.values(activeFilters).filter(value => {
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === "boolean") return value;
            return value !== "" && value !== null && value !== undefined;
        }).length;

        // Handle individual filter change
        const handleFilterChange = (key: string, value: any) => {
            const newFilters = { ...activeFilters, [key]: value };
            onFilterChange(newFilters);
        };

        // Handle reset
        const handleReset = () => {
            const resetFilters: Record<string, any> = {};
            filters.forEach(filter => {
                switch (filter.type) {
                    case "multiselect":
                        resetFilters[filter.key] = [];
                        break;
                    case "toggle":
                        resetFilters[filter.key] = false;
                        break;
                    default:
                        resetFilters[filter.key] = "";
                }
            });
            onFilterChange(resetFilters);
            onReset?.();
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col gap-4 p-4 bg-card border border-border rounded-lg",
                    className
                )}
                {...props}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                        {showCount && activeFilterCount > 0 && (
                            <Badge variant="secondary" size="sm">
                                {activeFilterCount} active
                            </Badge>
                        )}
                    </div>
                    {showReset && activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-xs"
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filters.map((filter) => {
                        const value = activeFilters[filter.key];

                        switch (filter.type) {
                            case "select":
                                return (
                                    <SelectFilter
                                        key={filter.key}
                                        filter={filter}
                                        value={value}
                                        onChange={(newValue) => handleFilterChange(filter.key, newValue)}
                                    />
                                );
                            case "multiselect":
                                return (
                                    <MultiSelectFilter
                                        key={filter.key}
                                        filter={filter}
                                        value={value}
                                        onChange={(newValue) => handleFilterChange(filter.key, newValue)}
                                    />
                                );
                            case "toggle":
                                return (
                                    <ToggleFilter
                                        key={filter.key}
                                        filter={filter}
                                        value={value}
                                        onChange={(newValue) => handleFilterChange(filter.key, newValue)}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}
                </div>

                {/* Active Filters Display */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Active:</span>
                        {filters.map((filter) => {
                            const value = activeFilters[filter.key];
                            if (!value || (Array.isArray(value) && value.length === 0)) return null;

                            if (Array.isArray(value)) {
                                return value.map((v) => {
                                    const option = filter.options?.find(opt => opt.value === v);
                                    return (
                                        <Badge
                                            key={`${filter.key}-${v}`}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                        >
                                            {filter.label}: {option?.label || v}
                                        </Badge>
                                    );
                                });
                            }

                            if (typeof value === "boolean" && value) {
                                return (
                                    <Badge
                                        key={filter.key}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        {filter.label}
                                    </Badge>
                                );
                            }

                            if (value !== "") {
                                const option = filter.options?.find(opt => opt.value === value);
                                return (
                                    <Badge
                                        key={filter.key}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        {filter.label}: {option?.label || value}
                                    </Badge>
                                );
                            }

                            return null;
                        })}
                    </div>
                )}
            </div>
        );
    }
);

FilterBar.displayName = "FilterBar";

export default FilterBar;