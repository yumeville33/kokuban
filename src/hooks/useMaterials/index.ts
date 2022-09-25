import { useEffect, useState } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";

import { storage } from "@/utils/firebase";

const MAX_MATERIALS = 9;

const useMaterials = () => {
  const [materials, setMaterials] = useState<Array<string>>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getMaterials = async () => {
      const listRef = ref(storage, "educ-content");
      const res = await listAll(listRef);
      const _materials = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return url;
        })
      );
      setMaterials(_materials);
    };

    getMaterials();
  }, []);

  const indexOfLastMaterial = currentPage * MAX_MATERIALS;
  const indexOfFirstMaterial = indexOfLastMaterial - MAX_MATERIALS;
  const currentMaterials = materials.slice(
    indexOfFirstMaterial,
    indexOfLastMaterial
  );

  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(materials.length / MAX_MATERIALS)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    materials,
    currentMaterials,
    handlePrev,
    handleNext,
  };
};

export default useMaterials;
