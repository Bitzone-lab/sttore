export default function control_helper<T>(sthp: Map<keyof T, string>): {
    helper: (key: keyof T, value?: string | undefined) => string;
    helpers: (values?: Record<keyof T, string> | undefined) => Record<keyof T, string>;
};
