async registerServiceWorker(applicationServerPublicKey) {
        const applicationServerKey = this.urlB64ToUint8Array(applicationServerPublicKey);
        const sw = await navigator.serviceWorker.register(`/service-worker.js`, { scope: '/' });

        try {
            if (Notification.permission === 'denied') {
                return;
            }
            let subscription = await sw.pushManager.getSubscription();

            let isSubscribed = !(subscription === null);

            if (!isSubscribed) {
                subscription = await sw.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey
                });
                isSubscribed = true;
            }

            return JSON.stringify(subscription.toJSON());
        } catch (err) {
            console.log('Failed to subscribe the user: ', err);
            return null;
        }
    }
