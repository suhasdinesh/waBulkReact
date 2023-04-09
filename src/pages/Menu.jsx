import React from "react";
import { Redirect, Route } from "react-router";
import { logoWhatsapp, settings } from "ionicons/icons";
import { IonContent, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from "@ionic/react";
import SendMessage from "./SendMessage";
import Settings from "./Settings";

const Menu = () => {
  const paths = [
    { name: "App", url: "/app", icon: logoWhatsapp },
    { name: "Settings", url: "/settings", icon: settings },
  ];
  return (
    <IonPage>
      <IonSplitPane
        contentId="main"
        style={{ "--side-max-width": "20%" }}
      >
        <IonMenu contentId="main">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>WA Bulk</IonTitle>

                </IonToolbar>
            </IonHeader>
            <IonContent>
                {paths.map((item,index)=>{
                    return(
                        <IonMenuToggle key={index} autoHide={false}>
                            <IonItem routerLink={item.url} routerDirection='none'>
                                <IonIcon icon={item.icon} slot='start'/>
                                {item.name}
                            </IonItem>
                        </IonMenuToggle>
                    )
                })}
            </IonContent>
        </IonMenu>
        <IonRouterOutlet id='main'>
            <Route exact path='/app' component={SendMessage}/>
            <Route exact path='/settings' component={Settings}/>
            <Route exact path='/'>
                <Redirect to='/app'/>
            </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;