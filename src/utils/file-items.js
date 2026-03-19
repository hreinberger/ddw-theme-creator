const createItemId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const createPreviewItem = (file, options = {}) => ({
    id: options.id || createItemId(),
    name: options.name || file.name,
    preview: options.preview || URL.createObjectURL(file),
    file
})

export const createPreviewItems = files => files.map(file => createPreviewItem(file))
