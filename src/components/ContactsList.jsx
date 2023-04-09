// ContactListBox.jsx
import React, { useRef } from "react";
import {
  IonList,
  IonItemSliding,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonItemOptions,
  IonItemOption,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonContent,
  IonSearchbar
} from "@ionic/react";

const ContactListBox = ({
  filteredNumbers,
  selectedPhoneNumbers,
  handleSelectAll,
  handlePhoneNumberSelection,
  handleContactDelete,
  loadMoreItems,
  hasMore,
  selectAll,
  filterNumbers,
  contentRef,
}) => {
  const infiniteScrollRef = useRef(null);

  const handleInfiniteScroll = async (e) => {
    await loadMoreItems();
    e.target.complete();

    if (!hasMore) {
      e.target.disabled = true;
    }
  };

  return (
    <IonContent ref={contentRef} style={{ minHeight: "60vh" }}>
      <IonList>
        <IonSearchbar
          onInput={(e) => {
            // setSearchText(e.detail.value);
            filterNumbers(e.target.value);
          }}
          onIonClear={()=>{filterNumbers("")}}
          placeholder="Search"
        />
        <IonItem>
          <IonLabel>Select All</IonLabel>
          <IonCheckbox
            checked={selectAll}
            legacy={true}
            onIonChange={(e) => handleSelectAll(e.detail.checked)}
          />
        </IonItem>
        {filteredNumbers.map((numberEntry) => (
          <IonItemSliding key={numberEntry.phone}>
            <IonItem key={numberEntry.phone}>
              <IonLabel>
                <h2>{numberEntry.name}</h2>
                <p>{numberEntry.phone}</p>
              </IonLabel>
              <IonCheckbox
                checked={selectedPhoneNumbers.includes(numberEntry.whatsappId)}
                onIonChange={(e) =>
                  handlePhoneNumberSelection(
                    numberEntry.whatsappId,
                    e.detail.checked
                  )
                }
              />
            </IonItem>
            <IonItemOptions>
              <IonItemOption
                onClick={() => {
                  handleContactDelete(numberEntry.phone);
                }}
                color="danger"
              >
                Delete
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonList>
      <IonInfiniteScroll
        ref={infiniteScrollRef}
        onIonInfinite={(ev) => {
          handleInfiniteScroll(ev);
          setTimeout(() => ev.target.complete(), 500);
        }}
      >
        <IonInfiniteScrollContent
          loadingText="Loading more contacts..."
          loadingSpinner="bubbles"
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  );
};

export default ContactListBox;
