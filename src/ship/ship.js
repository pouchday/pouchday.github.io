import Alpine from "alpinejs";

Alpine.data('shipWizard', () => ({
    currentStep: 1,
    missionaryName: '',
    selectedMission: '',
    officeAddress: '',
    packageWeight: '',
    customerEmail: '',
    orderUuid: '',
    nextRedirectUrl: '',
    showVideoModal: false,
    isSubmitting: false,

    // Structured items control tracking
    itemRows: [{ id: 1 }],
    nextRowId: 2,

    missionsList: [],
    missionAddresses: {},

    init() {
        this.orderUuid = this.generateUuid();
        this.loadMissions();
    },

    generateUuid() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
    },

    addItemField() {
        this.itemRows.push({ id: this.nextRowId });
        this.nextRowId++;
    },

    removeItemField(id) {
        this.itemRows = this.itemRows.filter(item => item.id !== id);
    },

    calculatePrice() {
        const baseWeight = parseFloat(this.packageWeight) || 0;
        if (baseWeight <= 0) return "0.00";
        // Simple logic template rule: e.g. base $15 plus $2.50 per lb
        const calculation = 15 + (baseWeight * 2.50);
        return calculation.toFixed(2);
    },

    loadMissions() {
        const shipTsvUrl = "https://docs.google.com/spreadsheets/d/1pNKEJRMOZY2yTuOt91vOZ9qeRW5S9oVaF9NnkLsoEOc/export?gid=0&format=tsv";

        fetch(shipTsvUrl)
            .then(res => res.text())
            .then(text => {
                const lines = text.trim().split("\n");
                const headers = lines[0].split("\t").map(h => h.trim().toLowerCase());

                const nameIdx = headers.findIndex(h => h.includes("mission") || h.includes("name"));
                const activeIdx = headers.findIndex(h => h.includes("active") || h.includes("available") || h.includes("accepting"));
                const addressIdx = headers.findIndex(h => h.includes("address"));

                const analyticalRows = lines.slice(1).map(line => line.split("\t").map(c => c.trim()));

                this.missionsList = analyticalRows.map(cols => {
                    const mName = cols[nameIdx];
                    if (!mName) return null;

                    const rawActive = activeIdx >= 0 ? cols[activeIdx] : "";
                    const available = rawActive === "" || rawActive.toLowerCase() !== "false";

                    if (addressIdx >= 0 && cols[addressIdx]) {
                        this.missionAddresses[mName] = cols[addressIdx];
                    }

                    return { name: mName, available: available };
                }).filter(Boolean);
            })
            .catch(err => {
                console.error("Failed to fetch tracking matrix maps", err);
            });
    },

    handleMissionChange() {
        this.officeAddress = this.missionAddresses[this.selectedMission] || '';
    },

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            window.scrollTo(0, 0);
        }
    },

    validateAndGoTo(targetStep) {
        // Native browser constraint verification wrapper trigger
        const currentForm = document.getElementById('shop-wizard-form');
        if (currentForm.checkValidity()) {
            this.currentStep = targetStep;
            window.scrollTo(0, 0);
        } else {
            currentForm.reportValidity();
        }
    },

    submitForm(event) {
        this.isSubmitting = true;

        const successUrl = `${window.location.origin}/ship/success/?id=${this.orderUuid}&weight=${this.packageWeight}&dest=${encodeURIComponent(this.selectedMission)}`;
        this.nextRedirectUrl = successUrl;

        // Wait a tick for changes to propagate into hidden inputs
        this.$nextTick(() => {
            const formData = new FormData(event.target);
            const uniqueId = Date.now();

            // Process files
            Array.from(formData.keys()).forEach((key) => {
                const file = formData.get(key);
                if (file instanceof File && file.name) {
                    const extension = file.name.split(".").pop() || "jpg";
                    const newName = `${key}_${uniqueId}.${extension}`;
                    const renamedFile = new File([file], newName, { type: file.type });
                    formData.set(key, renamedFile);
                }
            });

            fetch("https://formsubmit.co/pouchday-dev@proton.me", {
                method: "POST",
                body: formData,
            })
                .then(() => {
                    window.location.href = successUrl;
                })
                .catch((error) => {
                    console.error("Submission Error:", error);
                    alert("Upload failed.");
                    this.isSubmitting = false;
                });
        });
    }
}));
