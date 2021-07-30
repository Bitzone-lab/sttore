export default function control_helper<T>(sthp: Map<keyof T, any>) {
    function helper(key: keyof T, value?: any): any {
        if (value === undefined) {
            return sthp.get(key) || ''
        }

        sthp.set(key, value)
        return value
    }

    function helpers(values?: Record<keyof T, any>): Record<keyof T, any> {
        const data: Record<any, any> = {}
        if (values) {
            for (const key in values) {
                if (sthp.has(key)) {
                    sthp.set(key, values[key])
                }
            }
        }

        sthp.forEach(function (value, key) {
            data[key] = value
        })

        return data
    }

    return {
        helper,
        helpers
    }
}
