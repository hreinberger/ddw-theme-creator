import { ReactSortable } from "react-sortablejs"

const SortableThumbnailList = ({
    items,
    setItems,
    containerClassName = "thumbnail-container",
    emptyInsertThreshold
}) => (
    <div className={containerClassName}>
        <ReactSortable
            list={items}
            setList={setItems}
            group="images"
            ghostClass="thumbnail-placeholder"
            forceFallback={true}
            animation={150}
            {...(emptyInsertThreshold ? { emptyInsertThreshold } : {})}
        >
            {items.map(item => (
                <div className="thumbnail draggable hover-fade-no-pointer" key={item.id}>
                    <div className="thumbnail-inner">
                        <img alt={item.name} className="thumbnail-image" src={item.preview} />
                    </div>
                </div>
            ))}
        </ReactSortable>
    </div>
)

export default SortableThumbnailList
