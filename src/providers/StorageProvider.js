import { createContext, useContext, useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import axios from "axios";

const PRIVATE_KEY = "contacts";

export const StorageContext = createContext({});
export const StorageProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);

  useEffect(() => {
    const init = async () => {
      const newStore = new Storage({
        name: "wa-bulk",
        driverOrder: [
          CordovaSQLiteDriver._driver,
          Drivers.IndexedDB,
          Drivers.LocalStorage,
        ],
      });
      await newStore.defineDriver(CordovaSQLiteDriver);
      const store = await newStore.create();
      console.log("Store Ready");
      setStore(store);
      //
      const loadedServerUrl = await loadServerUrl();
      if (loadedServerUrl) {
        setServerUrl(loadedServerUrl);
      }
    };
    init();
  }, []);

  

  const loadContacts = async () => {
    const value = await store?.get(PRIVATE_KEY);
    return value || [];
  };

  const saveContacts = async (contacts) => {
    store?.set(PRIVATE_KEY, contacts);
  };

  const saveServerUrl = async (url) => {
    store?.set("ServerUrl", url);
  };

  const loadServerUrl = async () => {
    const value = await store?.get("ServerUrl");
    return value || "";
  };

  const deleteContact = async (phoneNumber) => {
    const contacts = await loadContacts();
    const updatedContacts = contacts.filter(
      (contact) => contact.phone !== phoneNumber
    );
    await saveContacts(updatedContacts);
  };

  const deleteContacts = async () => {
    await store?.remove(PRIVATE_KEY);
  };

  const value = {
    loadContacts,
    saveContacts,
    saveServerUrl,
    loadServerUrl,
    deleteContact,
    deleteContacts,
  };

  return store ? (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  ) : (
    <></>
  );
};

export const useStorage = () => {
  return useContext(StorageContext);
};
