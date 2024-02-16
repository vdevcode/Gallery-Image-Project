import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import "./App.css";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,  
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { ImageGallery } from "./types/global.types";
import { initialImageData } from "./data";
import ImageCards from "./components/ImageCards";
import AddImageCard from "./components/AddImageCard";

const App = () => {
  const [activeItem, setActiveItem] = useState<ImageGallery | null>(null);
  const [galleryData, setGalleryData] = useState(initialImageData);

  console.log(activeItem);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    if (!id) return;
    const currentItem = galleryData.find((item) => item.id);
    setActiveItem(currentItem || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      setGalleryData((item) => {
        const oldIndex = item.findIndex((item) => item.id === active.id);
        const newIndex = item.findIndex((item) => item.id === over.id);
        return arrayMove(item, oldIndex, newIndex);
      });
    }
  };

  const handleSelectImage = (id: string | number) => {
    // if galleryData.isSelected === true then set to false and vice versa
    const newGalleryData = galleryData.map((imageItem) => {
      if (imageItem.id === id) {
        return {
          ...imageItem,
          isSelected: !imageItem.isSelected,
        };
      }

      return imageItem;
    });

    setGalleryData(newGalleryData);
  };

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center">
        <div className="bg-white my-8 rounded-lg shadow max-w-5xl grid divide-y">
          <header className="text-2xl p-8">Thư viện ảnh</header>

          {/* dnd drag  */}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 p-8">
              <SortableContext
                items={galleryData}
                strategy={rectSortingStrategy}
              >
                {galleryData.map((items) => (
                  <ImageCards
                    key={items.id}
                    id={items.id}
                    isSelected={items.isSelected}
                    slug={items.slug}
                    onClick={handleSelectImage}
                    className={""}
                  />
                ))}
              </SortableContext>
              <AddImageCard setGalleryData={setGalleryData}/>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default App;
