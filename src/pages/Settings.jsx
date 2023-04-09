import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonToast,
  IonModal,
  IonInput,
  IonProgressBar,
} from "@ionic/react";
import {
  cloudUploadOutline,
  logoGoogle,
  logoWhatsapp,
  serverOutline,
  trash,
  trashBin,
} from "ionicons/icons";
import React, { useRef, useState, useEffect } from "react";
import { useStorage } from "../providers/StorageProvider";
import Papa from "papaparse";
import axios from "axios";

export default function Settings() {
  const {
    loadContacts,
    saveContacts,
    saveServerUrl,
    loadServerUrl,
    deleteContacts,
  } = useStorage();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const init = async () => {
      const value = await loadServerUrl();
      setApiUrl(String(value));
    };
    init();
  }, []);

  const handleSaveUrl = () => {
    saveServerUrl(apiUrl);
    setShowModal(false);
  };

  const fileInputRef = useRef(null);
  const handleFileUpload = (event) => {
    console.log(event);
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const contacts = results.data.map((row) => {
            if (row.Telephone) {
              // Remove any non-digit characters, like spaces, dashes, and parentheses
              const phone = row.Telephone.replace(/\D+/g, "");
  
              // Add the domain "@c.us" to the phone number
              const whatsappId = `${phone}@c.us`;
  
              return {
                name: row.Name,
                phone: phone,
                whatsappId: whatsappId,
              };
            } else {
              return null;
            }
          }).filter(contact => contact !== null);
  
          // Save the contacts to storage.
          await saveContacts(contacts);
          setLoading(false);
          setToastMessage("CSV file uploaded successfully!");
          setToastColor("success");
          setShowToast(true);
          // console.log(contacts)
        },
        error: (error) => {
          console.error("Error while parsing the CSV file: ", error);
          // Add failure toast
          setToastMessage("Failed to upload CSV file!");
          setToastColor("danger");
          setShowToast(true);
  
          // Set the loading state back to false after processing the file
          setLoading(false);
        },
      });
    } else {
      setLoading(false);
    }
  };
  

  const handleWhatsappImport = async () => {
    setShowProgress(true);
    setProgress(0);
    try {
      const response = await axios.post(
        "http://localhost:8080/getAllContacts",
        {},
        {
          headers: {
            Accept: "*/*",
            "Access-Control-Allow-Origin": "*", // This header should be set on the server, not the client
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const contacts = response.data.response.map((contact, index) => {
          // Simulate progress by incrementing the progress value
          setTimeout(() => {
            setProgress((index + 1) / response.data.response.length);
          }, 50 * index);

          // Remove the "@c.us" part from the WhatsApp ID
          let phone = contact.id.replace("@c.us", "");
          return {
            name: contact.name,
            phone : phone,
            whatsappId: contact.id,
          };
        });

        // Wait for the progress simulation to complete
        await new Promise((resolve) =>
          setTimeout(resolve, 50 * response.data.response.length)
        );

        await saveContacts(contacts);
        setToastMessage("Contacts imported successfully!");
        setToastColor("success");
        setShowToast(true);
        setShowProgress(false);
        return contacts;
      } else {
        console.error("Error fetching contacts");
        setToastMessage("Failed to import contacts!");
        setToastColor("danger");
        setShowToast(true);
        setShowProgress(false);
        return [];
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setToastMessage("Failed to import contacts!");
      setToastColor("danger");
      setShowToast(true);
      setShowProgress(false);
      return [];
    }
  };

  const handleDeleteAll = async () => {
    await deleteContacts();
    setToastMessage("Deleted All Contacts");
    setToastColor("danger");
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonProgressBar
        value={progress}
        type="determinate"
        hidden={!showProgress}
      ></IonProgressBar>

      <IonModal
        isOpen={showModal}
        onDidDismiss={() => {
          setShowModal(false);
        }}
        style={{ "--max-height": "40%" }}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Set Server Address</IonTitle>
            <IonButtons slot="primary">
              <IonButton onClick={() => setShowModal(false)}>Cancel</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Server URL</IonLabel>
            <IonInput
              value={apiUrl}
              aria-label="Server URL"
              onIonChange={(e) => setApiUrl(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonButton expand="block" onClick={handleSaveUrl}>
            Save
          </IonButton>
        </IonContent>
      </IonModal>
      <IonLoading isOpen={loading} message={"Uploading..."} />
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        color={toastColor}
        style={{ "--color": "white" }}
      />
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonItem style={{ borderWidth: 5 }}>
              <IonLabel>
                <h2>Upload Contacts</h2>
                <p color="secondary">
                  Upload a CSV file to import your contacts
                </p>
              </IonLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(e) => {
                  console.log(e.target);
                  const file = e.target.files[0];
                  if (file) {
                    console.log("Inside if", e);
                    handleFileUpload(e);
                  } else {
                    console.log("Inside else", e);
                    setLoading(false);
                  }
                }}
              />
              <IonButton
                size="default"
                onClick={() => {
                  fileInputRef.current.click();
                  setLoading(true); // Set loading state to true
                }}
                autoCapitalize={false}
                slot="end"
              >
                <IonIcon
                  icon={cloudUploadOutline}
                  style={{ marginRight: 5 }}
                ></IonIcon>{" "}
                Upload
              </IonButton>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Server URL</h2>
                <p>Enter your server URL</p>
              </IonLabel>
              <IonButton
                slot="end"
                size="default"
                onClick={() => setShowModal(true)}
              >
                <IonIcon
                  style={{ marginRight: 5 }}
                  icon={serverOutline}
                ></IonIcon>
                Set Address
              </IonButton>
            </IonItem>
            <IonItem disabled>
              <IonLabel>
                <h2>Google Contacts (Coming Soon)</h2>
                <p>Get Contacts from your Google Account</p>
              </IonLabel>
              <IonButton slot="end" color={"danger"} size="default">
                <IonIcon style={{ marginRight: 5 }} icon={logoGoogle}></IonIcon>
                Connect
              </IonButton>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Whatsapp Contacts</h2>
                <p>Import all existing Whatsapp Contacts</p>
              </IonLabel>
              <IonButton
                size="md"
                slot="end"
                color="success"
                onClick={handleWhatsappImport}
              >
                <IonIcon
                  style={{ marginRight: 5 }}
                  icon={logoWhatsapp}
                ></IonIcon>
                Sync
              </IonButton>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2>Delete Contacts</h2>
                <p>Delete all existing Contacts from app</p>
              </IonLabel>
              <IonButton
                size="md"
                slot="end"
                fill="outline"
                color="danger"
                onClick={handleDeleteAll}
              >
                <IonIcon style={{ marginRight: 5 }} icon={trashBin}></IonIcon>
                Delete
              </IonButton>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
