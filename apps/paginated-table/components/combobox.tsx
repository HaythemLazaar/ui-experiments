import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { JSX, ReactElement, ReactNode, useState } from "react";

type ComboboxItem<T> = {
  name: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  item: T;
  customInfo?: ReactNode | ReactElement | (() => JSX.Element);
};

function Combobox<T>({
  children,
  multi = false,
  fallbackIcon,
  options,
  loading,
  error,
  onSelect,
  placeholder,
  className,
  inDialog = true,
  closeOnSelect = false,
}: {
  children: ReactNode;
  multi?: boolean;
  fallbackIcon?: ReactNode;
  options?: ComboboxItem<T>[];
  loading: boolean;
  error?: string;
  onSelect: (option: T | T[]) => void;
  placeholder?: string;
  className?: string;
  inDialog?: boolean;
  closeOnSelect?: boolean;
}) {
  const [open, setOpen] = useState(false);
  function handleSelect(item: ComboboxItem<T>) {
    if (multi) {
      let selectedItems =
        options?.filter((o) => o.selected).map((o) => o.item) || [];
      if (selectedItems.includes(item.item)) {
        selectedItems = selectedItems.filter((o) => o !== item.item);
      } else {
        selectedItems.push(item.item);
      }
      onSelect(selectedItems);
      if (closeOnSelect) {
        setOpen(false);
      }
    } else {
      setOpen(false);
      onSelect(item.item);
    }
  }
  const selected = multi
    ? options?.filter((o) => o.selected) || []
    : options?.find((o) => o.selected) || null;
  if (loading)
    return (
      <div
        className={cn(
          "bg-white animate-pulse [&>span]:font-medium shadow border border-text-200/20 rounded-md w-fit px-2 h-[29.5px] flex items-center gap-1 text-text text-[13px] font-semibold",
          className
        )}
      >
        {children}
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "py-1 px-2 rounded-md border border-text-200/30 bg-white text-text hover:bg-background-300/40 font-semibold shadow flex gap-1 text-[13px] items-center w-fit",
          className
        )}
      >
        {multi && (selected as ComboboxItem<T>[]).length > 0 ? (
          (selected as ComboboxItem<T>[]).length > 1 ? (
            <>
              <div className="flex items-center">
                {(selected as ComboboxItem<T>[])[0]?.icon ? (
                  (selected as ComboboxItem<T>[])
                    .slice(0, 2)
                    .map((item, index) => (
                      <div
                        className="[&>svg]:size-4"
                        style={{ marginLeft: `-${index * 4}px` }}
                        key={index}
                      >
                        {item.icon}
                      </div>
                    ))
                ) : (
                  <div className="[&>svg]:size-4">{fallbackIcon}</div>
                )}
              </div>
              <span>{(selected as ComboboxItem<T>[]).length} Selected</span>
            </>
          ) : (
            <>
              <div className="[&>svg]:size-4">
                {(selected as ComboboxItem<T>[])[0]?.icon || fallbackIcon}
              </div>
              {(selected as ComboboxItem<T>[])[0]?.name}
            </>
          )
        ) : selected === null ? (
          children
        ) : (selected as ComboboxItem<T>[]).length === 0 ? (
          children
        ) : (
          <>
            <div className="[&>svg]:size-4">
              {(selected as ComboboxItem<T>)?.icon || fallbackIcon}
            </div>
            {(selected as ComboboxItem<T>)?.name}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.preventDefault()}
        // side="bottom"
        align="start"
        className="border border-text-200/30 p-0 max-w-96 w-fit"
        inDialog={inDialog}
      >
        <Command>
          <CommandInput placeholder={placeholder} noSearchIcon>
            <div className="flex items-center gap-2 [&>svg]:size-4 [&>svg]:text-text-200 absolute end-2">
                {fallbackIcon}
            </div>
          </CommandInput>
          <CommandList>
            {multi && options && (
              <>
                {options
                  ?.filter((o) => o.selected)
                  .map((item) => (
                    <CommandItem
                      key={item.name}
                      onSelect={() => handleSelect(item)}
                      className="group/item font-semibold text-[13px]"
                    >
                      <Checkbox
                        className={cn("size-4", "opacity-100")}
                        checked
                        onCheckedChange={() => handleSelect(item)}
                      />
                      {item.icon}
                      {item.name}
                    </CommandItem>
                  ))}
                <CommandSeparator />
              </>
            )}
            {options
              ?.filter((o) => (multi ? !o.selected : true))
              .map((option) => (
                <CommandItem
                  key={option.name}
                  onSelect={() => handleSelect(option)}
                  className="group/item font-semibold text-[13px]"
                >
                  {multi && (
                    <Checkbox
                      className={cn(
                        "size-4",
                        "opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity duration-200",
                        (selected as ComboboxItem<T>[]).includes(option) &&
                          "opacity-100"
                      )}
                      checked={(selected as ComboboxItem<T>[]).includes(option)}
                      onCheckedChange={() => handleSelect(option)}
                    />
                  )}
                  {!multi && (
                    <Check
                      className={cn(
                        "size-4",
                        "opacity-0 transition-opacity duration-200",
                        (selected === option) ?
                          "opacity-100" : "group-hover/item:opacity-30"
                      )}
                    />
                  )}
                  {option.icon}
                  {option.name}
                  {option.description && (
                    <span className="text-text-200 text-[12px]">
                      - {option.description}
                    </span>
                  )}
                  {option.customInfo && (
                    <div className="ml-auto">
                      {typeof option.customInfo === "function" ? option.customInfo() : option.customInfo}
                    </div>
                  )}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
