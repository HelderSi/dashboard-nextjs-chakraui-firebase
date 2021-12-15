import { useCallback, useState, useRef } from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/toast";
import AvatarEditor from "react-avatar-editor";
import FileUpload from "../../atoms/FileUpload";

import { storage } from "src/services/firebase";
import { useAuth } from "src/contexts/AuthUserContext";

export default function UserAvatarEditor() {
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const imageEditorRef = useRef<AvatarEditor>(null);

  const { authUser, updateCurrentUserProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleStartEdit = useCallback(
    (fileDataUrl: string) => {
      fileDataUrl && setImageUrl(fileDataUrl);
      onOpen();
    },
    [onOpen]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const editor = imageEditorRef.current;
      if (!editor) return;
      const dataString = editor.getImageScaledToCanvas().toDataURL();
      const imageStoragePath = `/users/${authUser?.uid}/public/profile/avatar`;

      await storage.uploadString(imageStoragePath, dataString, "data_url");
      const photoURL = await storage.getDownloadURL(imageStoragePath);
      await updateCurrentUserProfile({ photoURL });
      onClose();
    } catch (err) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    setSaving(false);
  }, [imageEditorRef, updateCurrentUserProfile, onClose]);

  return (
    <>
      <FileUpload
        placeholder="Mudar foto"
        acceptedFileTypes={["image/*"]}
        onChange={handleStartEdit}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar foto do perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody mx='auto'>
            <AvatarEditor
              ref={imageEditorRef}
              image={imageUrl}
              width={250}
              height={250}
              border={50}
              color={[255, 255, 255, 0.8]} // RGBA
              scale={1.2}
              rotate={0}
              borderRadius={200}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleSave}
              isLoading={saving}
            >
              Salvar
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={saving}>
              Cancelar edição
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
