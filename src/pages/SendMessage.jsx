import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonButton,
  IonTextarea,
  IonIcon,
  IonProgressBar,
  IonLoading,
} from "@ionic/react";
import { filter, trashBinOutline } from "ionicons/icons";
import React, { useState, useEffect, useRef } from "react";
import "./SendMessage.css";
import { useStorage } from "../providers/StorageProvider";
import ContactListBox from "../components/ContactsList";
import axios from "axios";


export default function SendMessage() {



  const contentRef = useRef(null);

  const [numbers, setNumbers] = useState([]);

  const { loadContacts, deleteContact } = useStorage();

  // State for message input
  const [message, setMessage] = useState("");

  // State for selected phone numbers

  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);

  // State for search text input
  const [searchText, setSearchText] = useState("");

  // State for filtered phone numbers based on search input
  const [filteredNumbers, setFilteredNumbers] = useState(numbers);

  // State for "Select All" checkbox
  const [selectAll, setSelectAll] = useState(false);

  // State to manage the displayed items
  const [displayedNumbers, setDisplayedNumbers] = useState([]);

  // Define the hasMore variable
  const [hasMore, setHasMore] = useState(true);

  const [sendingProgress, setSendingProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const loadedContacts = await loadContacts();
      setFilteredNumbers(loadedContacts);
      setNumbers(loadedContacts);
    };
    fetchContacts();
  }, [loadContacts]);

  useEffect(() => {
    const initialItems = filteredNumbers.slice(0, 7);
    setDisplayedNumbers(initialItems);
  }, [filteredNumbers]);

  // Function to handle selection of a phone number
  const handlePhoneNumberSelection = (phoneNumber, isChecked) => {
    if (isChecked) {
      setSelectedPhoneNumbers([...selectedPhoneNumbers, phoneNumber]);
    } else {
      setSelectedPhoneNumbers(
        selectedPhoneNumbers.filter((number) => number !== phoneNumber)
      );
    }
  };

  // Add a function to load more items when the infinite scroll is triggered
  const loadMoreItems = () => {
    setTimeout(() => {
      const newItems = filteredNumbers.slice(
        displayedNumbers.length,
        displayedNumbers.length + 5
      );
      setDisplayedNumbers([...displayedNumbers, ...newItems]);
    }, 500);
  };

  const filterNumbers = (searchValue) => {
    if (searchValue === "") {
      setFilteredNumbers(numbers);
      setDisplayedNumbers(numbers.slice(0, 5));
    } else {
      const filtered = numbers.filter((number) => {
        const name = number.name ? number.name.toLowerCase() : "";
        return name.includes(searchValue.toLowerCase());
      });
      setFilteredNumbers(filtered);
      setDisplayedNumbers(filtered.slice(0, 7));
    }
  };

  // Function to handle "Select All" checkbox toggle
  const handleSelectAll = (checked) => {
    setSelectAll(checked);

    if (checked) {
      setSelectedPhoneNumbers([
        ...new Set([
          ...selectedPhoneNumbers,
          ...displayedNumbers.map((numberEntry) => numberEntry.whatsappId),
        ]),
      ]);
    } else {
      const newSelectedNumbers = selectedPhoneNumbers.filter(
        (whatsappId) =>
          !displayedNumbers.some(
            (numberEntry) => numberEntry.whatsappId === whatsappId
          )
      );
      setSelectedPhoneNumbers(newSelectedNumbers);
    }
  };

  const handleContactDelete = async (number) => {
    // Save the scroll position before updating the state
    const scrollPosition = await contentRef.current.getScrollElement();

    await deleteContact(number);
    setNumbers((prevNumbers) =>
      prevNumbers.filter((contact) => contact.phone !== number)
    );
    setFilteredNumbers((prevFilteredNumbers) =>
      prevFilteredNumbers.filter((contact) => contact.phone !== number)
    );

    // Restore the scroll position after the state updates
    contentRef.current.scrollToPoint(
      scrollPosition.scrollLeft,
      scrollPosition.scrollTop,
      0
    );
  };

  const sendMessageToSelectedNumbers = async () => {
    
    setLoading(true);
    setSendingProgress(0);
    setSentCount(0);

    for (let i = 0; i < selectedPhoneNumbers.length; i++) {
      const number = selectedPhoneNumbers[i];

      // Send the message using the WhatsApp API
      try {
        await axios.post("http://localhost:8080/sendText", {
          args: {
            to: number,
            content: message,
          },
        });

        // Random interval between 5-9 seconds
        const interval = Math.floor(Math.random() * 5000) + 5000;
        await new Promise((resolve) => setTimeout(resolve, interval));

        // Update the progress and sent count
        setSendingProgress((i + 1) / selectedPhoneNumbers.length);
        setSentCount(i + 1);
      } catch (error) {
        console.error("Error sending message to:", number, error);
      }
    }

    // Reset progress and display a success message
    setLoading(false);
    setSendingProgress(0);
    setSentCount(0);
    console.log("Messages sent successfully!");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Send Message</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeLg="6">
              <IonCard>
                <IonCardContent style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <ContactListBox
                    filteredNumbers={displayedNumbers}
                    selectedPhoneNumbers={selectedPhoneNumbers}
                    handleSelectAll={handleSelectAll}
                    handlePhoneNumberSelection={handlePhoneNumberSelection}
                    handleContactDelete={handleContactDelete}
                    loadMoreItems={loadMoreItems}
                    hasMore={hasMore}
                    selectAll={selectAll}
                    filterNumbers={filterNumbers}
                    contentRef={contentRef}
                  />
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardContent>
                  <IonItem>
                    <IonTextarea
                      value={message}
                      onIonChange={(e) => {
                        setMessage(e.detail.value);
                      }}
                      placeholder="Enter your message here"
                      autoGrow
                    />
                  </IonItem>

                  <IonButtons style={{ marginTop: 20 }}>
                    <IonButton
                      color="primary"
                      fill="outline"
                      onClick={sendMessageToSelectedNumbers}
                    >
                      Send Message
                    </IonButton>
                    <IonButton style={{ marginLeft: 15 }}>
                      <IonIcon color="danger" icon={trashBinOutline}></IonIcon>
                    </IonButton>
                  </IonButtons>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonProgressBar
      value={sendingProgress}
      color="primary"
      style={{ marginBottom: 20 }}
    ></IonProgressBar>
    {sentCount > 0 && (
      <p>
        Sending message... {sentCount}/{selectedPhoneNumbers.length} sent
      </p>
    )}
    <IonLoading
      isOpen={loading}
      message={`Sending messages... ${sentCount}/${selectedPhoneNumbers.length}`}
      progress={sendingProgress}
    />
    </IonPage>
  );
}
