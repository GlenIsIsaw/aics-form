import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import { submitToGoogleSheets } from "../services/googleSheetsService";
import DataPrivacyModal from "../components/DataPrivacy";
import MaintenanceMode from "../components/MaintenanceMode";
import ApplicationEnded from "../components/ApplicationEnded";
import ErrorModal from "../components/ErrorModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { RUNTIME_CONFIG as CONFIG } from "../config";
import { logger } from "../utils/logger";
import "../styles/styles.css";

// Initialize logger with configuration
logger.initialize(CONFIG);

// Import only necessary icons
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaUsers,
  FaEdit,
  FaCheck,
  FaIdCard,
  FaBirthdayCake,
  FaVenusMars,
  FaHeart,
  FaBriefcase,
  FaMoneyBill,
  FaFileAlt,
  FaTrash,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";

// ==================== SECURE MAINTENANCE CONFIG ====================
const MAINTENANCE_CONFIG = {
  enabled: CONFIG.MAINTENANCE_ENABLED,
  startTime: "2024-01-30T14:00:00Z",
  endTime: "2024-01-31T22:00:00Z",
};

/**
 * Check maintenance status securely
 */
const checkMaintenanceStatus = () => {
  if (!MAINTENANCE_CONFIG.enabled) return false;

  try {
    const now = new Date();
    const maintenanceEnd = new Date(MAINTENANCE_CONFIG.endTime);
    const isMaintenance = now <= maintenanceEnd;

    logger.debug(`Maintenance check: ${isMaintenance ? "ACTIVE" : "INACTIVE"}`);
    return isMaintenance;
  } catch (error) {
    logger.error("Maintenance check failed", error);
    return false;
  }
};

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.2, duration: 0.5 },
  },
};

// Sample municipalities and barangays
const phLocations = {
  "BASUD/051601000": [
    "ANGAS/051601001",
    "BACTAS/051601002",
    "BINATAGAN/051601003",
    "CAAYUNAN/051601004",
    "GUINATUNGAN/051601005",
    "HINAMPACAN/051601006",
    "LANGA/051601007",
    "LANITON/051601008",
    "LIDONG/051601009",
    "MAMPILI/051601010",
    "MANDAZO/051601011",
    "MANGCAMAGONG/051601012",
    "MANMUNTAY/051601014",
    "MANTUGAWE/051601015",
    "MATNOG/051601016",
    "MOCONG/051601017",
    "OLIVA/051601018",
    "PAGSANGAHAN/051601019",
    "PINAGWARASAN/051601020",
    "PLARIDEL/051601021",
    "POBLACION 1/051601022",
    "SAN FELIPE/051601025",
    "SAN JOSE/051601027",
    "SAN PASCUAL/051601028",
    "TABA-TABA/051601030",
    "TACAD/051601031",
    "TAISAN/051601032",
    "TUACA/051601033",
    "POBLACION 2/051601034",
  ],
  "DAET (Capital)/051603000": [
    "ALAWIHAO/051603001",
    "AWITAN/051603002",
    "BAGASBAS/051603003",
    "BIBIRAO/051603004",
    "BORABOD/051603005",
    "CALASGASAN/051603006",
    "CAMAMBUGAN/051603007",
    "COBANGBANG (CARUMPIT)/051603008",
    "DOGONGAN/051603012",
    "GAHONON/051603013",
    "GUBAT/051603014",
    "LAG-ON/051603015",
    "MAGANG/051603018",
    "MAMBALITE/051603019",
    "MANCRUZ (MANGCRUZ)/051603021",
    "PAMORANGON/051603023",
    "BARANGAY I (POB.)/051603024",
    "BARANGAY II (POB.)/051603025",
    "BARANGAY III (POB.)/051603026",
    "BARANGAY IV (POB.)/051603027",
    "BARANGAY V (POB.)/051603028",
    "BARANGAY VI (POB.)/051603029",
    "BARANGAY VII (POB.)/051603030",
    "BARANGAY VIII (POB.)/051603031",
    "SAN ISIDRO/051603032",
  ],
  "MERCEDES/051607000": [
    "APUAO/051607001",
    "BARANGAY I (POB.)/051607002",
    "BARANGAY II (POB.)/051607003",
    "BARANGAY III (POB.)/051607004",
    "BARANGAY IV (POB.)/051607005",
    "BARANGAY V (POB.)/051607006",
    "BARANGAY VI (POB.)/051607007",
    "BARANGAY VII (POB.)/051607008",
    "CARINGO/051607009",
    "CATANDUNGANON/051607010",
    "CAYUCYUCAN/051607011",
    "COLASI/051607012",
    "DEL ROSARIO (TAGONGTONG)/051607013",
    "GABOC/051607014",
    "HAMORAON/051607015",
    "HINIPAAN/051607016",
    "LALAWIGAN/051607017",
    "LANOT/051607018",
    "MAMBUNGALON/051607019",
    "MANGUISOC/051607020",
    "MASALONGSALONG/051607021",
    "MATOOGTOOG/051607022",
    "PAMBUHAN/051607023",
    "QUINAPAGUIAN/051607024",
    "SAN ROQUE/051607025",
    "TARUM/051607026",
  ],
  "SAN LORENZO RUIZ (IMELDA)/051604000": [
    "DACULANG BOLO/051604001",
    "DAGOTDOTAN/051604002",
    "LANGGA/051604003",
    "LANITON/051604004",
    "MAISOG/051604005",
    "MAMPUROG/051604006",
    "MANLIMONSITO/051604007",
    "MATACONG (POB.)/051604008",
    "SALVACION/051604009",
    "SAN ANTONIO/051604010",
    "SAN ISIDRO/051604011",
    "SAN RAMON/051604012",
  ],
  "SAN VICENTE/051609000": [
    "ASDUM/051609001",
    "CABANBANAN/051609002",
    "CALABAGAS/051609003",
    "FABRICA/051609004",
    "IRAYA SUR/051609005",
    "MAN-OGOB/051609006",
    "POBLACION DISTRICT I (SILANGAN/BGY. 1)/051609007",
    "POBLACION DISTRICT II (KANLURAN/BGY. 2)/051609008",
    "SAN JOSE (IRAYA NORTE)/051609009",
  ],
  "TALISAY/051611000": [
    "BINANUAAN/051611001",
    "CAAWIGAN/051611002",
    "CAHABAAN/051611003",
    "CALINTAAN/051611004",
    "DEL CARMEN/051611005",
    "GABON/051611006",
    "ITOMANG/051611007",
    "POBLACION/051611008",
    "SAN FRANCISCO/051611009",
    "SAN ISIDRO/051611010",
    "SAN JOSE/051611011",
    "SAN NICOLAS/051611012",
    "SANTA CRUZ/051611013",
    "SANTA ELENA/051611014",
    "SANTO NIÑO/051611015",
  ],
  "VINZONS/051612000": [
    "AGUIT-IT/051612001",
    "BANOCBOC/051612002",
    "CAGBALOGO/051612004",
    "CALANGCAWAN NORTE/051612005",
    "CALANGCAWAN SUR/051612006",
    "GUINACUTAN/051612007",
    "MANGCAYO/051612008",
    "MANGCAWAYAN/051612009",
    "MANLUCUGAN/051612010",
    "MATANGO/051612011",
    "NAPILIHAN/051612012",
    "PINAGTIGASAN/051612013",
    "BARANGAY I (POB.)/051612014",
    "BARANGAY II (POB.)/051612015",
    "BARANGAY III (POB.)/051612016",
    "SABANG/051612017",
    "SANTO DOMINGO/051612018",
    "SINGI/051612019",
    "SULA/051612020",
  ],
};

const emptyClient = {
  firstName: "",
  middleName: "",
  lastName: "",
  extensionName: "",
  street: "",
  barangay: "",
  municipality: "",
  province: "CAMARINES NORTE/051600000",
  contactNumber: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  gender: "",
  civilStatus: "",
  occupation: "",
  monthlySalary: "",
  psaNationalId: "",
  email: "",
};

const emptyFamilyMember = {
  lastName: "",
  firstName: "",
  middleName: "",
  extensionName: "",
  gender: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  civilStatus: "",
  occupation: "",
  salary: "",
  contactNumber: "",
  relationship: "",
};

export default function SinglePageForm({ onSuccess }) {
  // ==================== INITIALIZATION ====================
  logger.debug("SinglePageForm component initialized", {
    environment: CONFIG.ENV,
    timestamp: new Date().toISOString(),
  });

  // ==================== APPLICATION ENDED CHECK ====================
  if (CONFIG.APPLICATION_ENDED) {
    logger.info("Application ended - showing ended screen");
    return <ApplicationEnded />;
  }

  // ==================== STATE MANAGEMENT ====================
  const [client, setClient] = useState(emptyClient);
  const [familyMembers, setFamilyMembers] = useState([
    { ...emptyFamilyMember },
  ]);
  const [errors, setErrors] = useState({});
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [showDataPrivacyModal, setShowDataPrivacyModal] = useState(
    CONFIG.ENABLE_DATA_PRIVACY_MODAL,
  );
  const [formEnabled, setFormEnabled] = useState(
    !CONFIG.ENABLE_DATA_PRIVACY_MODAL,
  );

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState({
    title: "",
    message: "",
    errors: [],
  });

  // ==================== EFFECTS ====================

  useEffect(() => {
    const maintenanceStatus = checkMaintenanceStatus();
    setIsMaintenance(maintenanceStatus);

    if (maintenanceStatus) {
      logger.warn("Application in maintenance mode");
    }
  }, []);

  useEffect(() => {
    if (CONFIG.ENABLE_DATA_PRIVACY_MODAL && !isMaintenance) {
      setShowDataPrivacyModal(true);
      setFormEnabled(false);
      logger.debug("Data privacy modal enabled");
    } else if (!isMaintenance) {
      setFormEnabled(true);
      setShowDataPrivacyModal(false);
    }
  }, [CONFIG.ENABLE_DATA_PRIVACY_MODAL, isMaintenance]);

  // ==================== EVENT HANDLERS ====================

  const handleDataPrivacyAccept = useCallback(() => {
    setFormEnabled(true);
    setShowDataPrivacyModal(false);
    logger.info("Data privacy policy accepted");
  }, []);

  const handleDataPrivacyClose = useCallback(() => {
    if (CONFIG.IS_PRODUCTION) {
      return;
    }
    setShowDataPrivacyModal(false);
  }, []);

  const handleClientChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === "middleName") {
      processedValue = value.replace(/\./g, "");
    }

    processedValue = [
      "firstName",
      "middleName",
      "lastName",
      "street",
      "email",
      "gender",
      "occupation",
    ].includes(name)
      ? processedValue.toUpperCase()
      : processedValue;

    setClient((prev) => ({ ...prev, [name]: processedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "municipality") {
      setClient((prev) => ({ ...prev, barangay: "" }));
    }
  };

  const handleMemberChange = (idx, field, value) => {
    const updated = [...familyMembers];
    let processedValue = value;

    if (field === "middleName") {
      processedValue = value.replace(/\./g, "");
    }

    processedValue = [
      "lastName",
      "firstName",
      "middleName",
      "occupation",
    ].includes(field)
      ? processedValue.toUpperCase()
      : processedValue;

    updated[idx][field] = processedValue;
    setFamilyMembers(updated);

    // Clear error for this field
    if (errors[`familyMember_${idx}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`familyMember_${idx}_${field}`]: "" }));
    }
  };

  const addMember = () => {
    if (familyMembers.length < 3) {
      setFamilyMembers((prev) => [...prev, { ...emptyFamilyMember }]);
    } else {
      setErrorModalData({
        title: "Maximum Limit Reached",
        message: "You can only add up to 3 family members.",
        errors: [],
      });
      setShowErrorModal(true);
    }
  };

  const removeMember = (idx) => {
    if (familyMembers.length > 1) {
      setFamilyMembers((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setErrorModalData({
        title: "Minimum Requirement",
        message: "At least one family member is required.",
        errors: [],
      });
      setShowErrorModal(true);
    }
  };

  const validateForm = useCallback(() => {
    const startTime = performance.now();

    try {
      const newErrors = {};

      // ===== GUARDIAN/APPLICANT VALIDATIONS =====
      if (!client.firstName?.trim()) {
        newErrors.firstName = "First Name is required";
      }

      if (!client.lastName?.trim()) {
        newErrors.lastName = "Last Name is required";
      }

      if (!client.municipality) {
        newErrors.municipality = "Municipality/City is required";
      }

      if (!client.barangay) {
        newErrors.barangay = "Barangay is required";
      }

      // Middle name validation (optional)
      if (client.middleName?.trim()) {
        const cleanMiddleName = client.middleName.replace(/\./g, "");

        if (cleanMiddleName.length === 1) {
          newErrors.middleName = "Middle name must be at least 2 letters";
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(cleanMiddleName)) {
          newErrors.middleName =
            "Middle name can only contain letters and spaces";
        }
      }

      // Birthdate validation
      if (!client.birthMonth || !client.birthDay || !client.birthYear) {
        if (!client.birthMonth)
          newErrors.birthMonth = "Birth month is required";
        if (!client.birthDay) newErrors.birthDay = "Birth day is required";
        if (!client.birthYear) newErrors.birthYear = "Birth year is required";
      } else {
        const birthYearNum = parseInt(client.birthYear);
        if (birthYearNum < 1940 || birthYearNum > 2024) {
          newErrors.birthYear = "Birth year must be between 1940 and 2024";
        }

        const dayNum = parseInt(client.birthDay);
        const monthNum = parseInt(client.birthMonth);

        if (monthNum === 2 && dayNum > 29) {
          newErrors.birthDay = "February has maximum 29 days";
        } else if ([4, 6, 9, 11].includes(monthNum) && dayNum > 30) {
          newErrors.birthDay = "This month has maximum 30 days";
        }
      }

      if (!client.contactNumber?.trim()) {
        newErrors.contactNumber = "Contact Number is required";
      }

      if (!client.gender) {
        newErrors.gender = "Gender is required";
      }

      if (!client.civilStatus) {
        newErrors.civilStatus = "Civil Status is required";
      }

      if (!client.occupation?.trim()) {
        newErrors.occupation = "Occupation is required";
      }

      if (!client.monthlySalary?.trim()) {
        newErrors.monthlySalary = "Monthly Salary is required";
      }

      // Contact number validation
      const contactRegex = /^09\d{9}$/;
      if (client.contactNumber) {
        const cleanNumber = client.contactNumber.replace(/\s/g, "");
        if (!contactRegex.test(cleanNumber)) {
          newErrors.contactNumber =
            "Please enter a valid 11-digit Philippine number starting with 09";
        }
        if (cleanNumber.length > 11) {
          newErrors.contactNumber = "Contact number must be exactly 11 digits";
        }
      }

      // PSA National ID validation (optional)
      const psaRegex = /^\d{12}$/;
      if (
        client.psaNationalId?.trim() &&
        !psaRegex.test(client.psaNationalId)
      ) {
        newErrors.psaNationalId =
          "PSA National ID must be exactly 12 digits (numbers only)";
      }

      // Email validation (optional)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (client.email?.trim() && !emailRegex.test(client.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      // ===== FAMILY MEMBERS VALIDATIONS =====
      familyMembers.forEach((member, index) => {
        const memberNum = index + 1;

        if (!member.lastName?.trim()) {
          newErrors[`familyMember_${index}_lastName`] =
            `Family member ${memberNum} last name is required`;
        }

        if (!member.firstName?.trim()) {
          newErrors[`familyMember_${index}_firstName`] =
            `Family member ${memberNum} first name is required`;
        }

        if (!member.gender) {
          newErrors[`familyMember_${index}_gender`] =
            `Family member ${memberNum} gender is required`;
        }

        if (!member.civilStatus) {
          newErrors[`familyMember_${index}_civilStatus`] =
            `Family member ${memberNum} civil status is required`;
        }

        if (!member.relationship) {
          newErrors[`familyMember_${index}_relationship`] =
            `Family member ${memberNum} relationship is required`;
        }

        // Birthdate validation for family members
        if (!member.birthMonth || !member.birthDay || !member.birthYear) {
          if (!member.birthMonth)
            newErrors[`familyMember_${index}_birthMonth`] =
              `Family member ${memberNum} birth month is required`;
          if (!member.birthDay)
            newErrors[`familyMember_${index}_birthDay`] =
              `Family member ${memberNum} birth day is required`;
          if (!member.birthYear)
            newErrors[`familyMember_${index}_birthYear`] =
              `Family member ${memberNum} birth year is required`;
        } else {
          const birthYearNum = parseInt(member.birthYear);
          if (birthYearNum < 1940 || birthYearNum > 2024) {
            newErrors[`familyMember_${index}_birthYear`] =
              `Family member ${memberNum} birth year must be between 1940 and 2024`;
          }
        }

        // Middle name validation (optional)
        if (member.middleName?.trim()) {
          const cleanMiddleName = member.middleName.replace(/\./g, "");

          if (cleanMiddleName.length === 1) {
            newErrors[`familyMember_${index}_middleName`] =
              `Family member ${memberNum} middle name must be at least 2 letters`;
          }

          const nameRegex = /^[A-Za-z\s]+$/;
          if (!nameRegex.test(cleanMiddleName)) {
            newErrors[`familyMember_${index}_middleName`] =
              `Family member ${memberNum} middle name can only contain letters and spaces`;
          }
        }

        // Contact number validation (optional)
        if (member.contactNumber?.trim()) {
          const cleanNumber = member.contactNumber.replace(/\s/g, "");
          if (!contactRegex.test(cleanNumber)) {
            newErrors[`familyMember_${index}_contactNumber`] =
              `Family member ${memberNum} please enter a valid 11-digit Philippine number starting with 09`;
          }
        }
      });

      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;

      const duration = performance.now() - startTime;
      logger.performance("Form validation", duration);

      return isValid;
    } catch (error) {
      logger.error("Form validation error", error);
      return false;
    }
  }, [client, familyMembers]);

  const handleReviewSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const startTime = performance.now();

      try {
        if (checkMaintenanceStatus()) {
          logger.warn("Submission blocked - maintenance mode active");
          setErrorModalData({
            title: "System Maintenance",
            message:
              "System is currently under maintenance. Please try again later.",
            errors: [],
          });
          setShowErrorModal(true);
          return;
        }

        const isValid = validateForm();

        if (isValid) {
          setShowModal(true);
          logger.info("Form validation passed - showing review modal");
        } else {
          logger.warn("Form validation failed - showing errors");

          // Get error messages directly from the errors state
          const errorMessages = Object.values(errors).filter(
            (msg) => msg && msg.trim() !== "",
          );

          setErrorModalData({
            title: "Form Validation Error",
            message:
              "Please fix the following errors before submitting your application:",
            errors:
              errorMessages.length > 0
                ? errorMessages
                : ["Please check all required fields and try again."],
          });

          setShowErrorModal(true);
        }

        const duration = performance.now() - startTime;
        logger.performance("Form submission handling", duration);
      } catch (error) {
        logger.error("Form submission error", error);
        setErrorModalData({
          title: "Unexpected Error",
          message:
            "An unexpected error occurred while processing your request.",
          errors: [
            "Please try again or contact support if the problem persists.",
          ],
        });
        setShowErrorModal(true);
      }
    },
    [validateForm, errors],
  );

  const handleProceedToConfirmation = () => {
    setShowModal(false);
    setShowConfirmationModal(true);
  };

  const handleFinalSubmit = useCallback(async () => {
    const startTime = performance.now();
    setShowConfirmationModal(false);
    setShowProgressModal(true);
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (checkMaintenanceStatus()) {
        throw new Error("System is under maintenance. Submission blocked.");
      }

      const sheetsData = {
        // Applicant/Guardian Information
        province: client.province,
        municipality: client.municipality,
        barangay: client.barangay,
        street: client.street,
        lastName: client.lastName,
        firstName: client.firstName,
        middleName: client.middleName,
        extensionName: client.extensionName,
        gender: client.gender,
        civilStatus: client.civilStatus,
        birthMonth: client.birthMonth,
        birthDay: client.birthDay,
        birthYear: client.birthYear,
        contactNumber: client.contactNumber,
        occupation: client.occupation,
        monthlySalary: client.monthlySalary,
        psaNationalId: client.psaNationalId,
        email: client.email,
      };

      const formattedFamilyMembers = familyMembers.map((member) => ({
        lastName: member.lastName,
        firstName: member.firstName,
        middleName: member.middleName,
        extensionName: member.extensionName,
        gender: member.gender,
        civilStatus: member.civilStatus,
        birthMonth: member.birthMonth,
        birthDay: member.birthDay,
        birthYear: member.birthYear,
        contactNumber: member.contactNumber,
        occupation: member.occupation,
        salary: member.salary,
        relationship: member.relationship,
      }));

      logger.logSubmission(sheetsData, formattedFamilyMembers);

      logger.info("Initiating Google Sheets submission");
      const submissionPromise = submitToGoogleSheets(
        sheetsData,
        formattedFamilyMembers,
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Submission timeout - please try again")),
          30000,
        ),
      );

      const result = await Promise.race([submissionPromise, timeoutPromise]);

      if (result.success) {
        logger.info("Form submitted successfully");

        setClient(emptyClient);
        setFamilyMembers([{ ...emptyFamilyMember }]);
        setErrors({});

        if (onSuccess) {
          onSuccess({
            applicant: client,
            familyMembers: formattedFamilyMembers,
            submissionResult: result,
          });
        }
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      logger.error("Form submission failed", err);

      if (err.message.includes("timeout")) {
        setSubmitError(
          "Submission took too long. Please check your internet connection and try again.",
        );
      } else if (
        err.message.includes("network") ||
        err.message.includes("fetch")
      ) {
        setSubmitError(
          "Network error. Please check your internet connection and try again.",
        );
      } else {
        setSubmitError(
          err.message ||
            "Something went wrong during submission. Please try again.",
        );
      }

      setShowConfirmationModal(true);
    } finally {
      setShowProgressModal(false);
      setIsSubmitting(false);
      const duration = performance.now() - startTime;
      logger.performance("Total submission process", duration);
    }
  }, [client, familyMembers, onSuccess]);

  // ==================== HELPER FUNCTIONS ====================

  const getApplicantFullName = () => {
    const names = [
      client.lastName,
      client.firstName,
      client.middleName,
      client.extensionName,
    ].filter(Boolean);
    return names.join(" ").toUpperCase();
  };

  const formatBirthdate = (birthYear, birthMonth, birthDay) => {
    if (birthYear && birthMonth && birthDay) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = monthNames[parseInt(birthMonth) - 1];
      return `${monthName} ${parseInt(birthDay)}, ${birthYear}`;
    }
    return "Not provided";
  };

  const formatApplicantBirthdate = () => {
    return formatBirthdate(
      client.birthYear,
      client.birthMonth,
      client.birthDay,
    );
  };

  const formatFamilyMemberDate = (year, month, day) => {
    return formatBirthdate(year, month, day);
  };

  // ==================== DEBUG TOOLS ====================

  const renderDebugTools = () => {
    if (!CONFIG.ENABLE_DEBUG_TOOLS) return null;

    const viewSavedData = () => {
      const submissions = JSON.parse(
        localStorage.getItem("formSubmissions") || "[]",
      );
      logger.debug("Saved submissions", submissions);
      alert(
        `You have ${submissions.length} saved submissions. Check browser console for details.`,
      );
    };

    const testConnection = async () => {
      logger.debug("Testing connection to Google Sheets...");
      const testData = {
        province: "CAMARINES NORTE",
        municipality: "Quezon City",
        barangay: "Commonwealth",
        street: "REACT TEST STREET",
        lastName: "REACTLAST",
        firstName: "REACTFIRST",
        middleName: "REACTMIDDLE",
        extensionName: "JR",
        birthdate: "2000-01-01",
        gender: "Male",
        civilStatus: "Single",
        contactNumber: "09123456789",
        psaNationalId: "123456789012",
        email: "react@test.com",
      };

      try {
        const result = await submitToGoogleSheets(testData, []);
        logger.debug("Test result:", result);
        alert("Test completed! Check browser console for details.");
      } catch (error) {
        logger.error("Test failed:", error);
        alert("Test failed: " + error.message);
      }
    };

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="card-wrapper"
      >
        <Card className="mb-3 custom-card debug-card">
          <Card.Header className="custom-card-header debug-header">
            <motion.h5
              className="mb-0"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
              🛠️ Development Tools
            </motion.h5>
          </Card.Header>
          <Card.Body className="custom-card-body">
            <Row>
              <Col md={6}>
                <Button
                  variant="outline-info"
                  onClick={viewSavedData}
                  className="w-100 mb-2 custom-btn"
                >
                  View Saved Data
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  variant="outline-warning"
                  onClick={testConnection}
                  className="w-100 mb-2 custom-btn"
                >
                  Test Connection
                </Button>
              </Col>
            </Row>
            <small className="text-muted form-text-custom">
              These tools help you view and manage form data during development.
            </small>

            <motion.div
              className="text-center mt-3 p-3 status-display rounded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h6>🔧 System Status</h6>
              <Row>
                <Col md={4}>
                  <small className="text-muted">
                    Maintenance:{" "}
                    <strong
                      className={isMaintenance ? "text-danger" : "text-success"}
                    >
                      {isMaintenance ? "🔴 ACTIVE" : "🟢 NORMAL"}
                    </strong>
                  </small>
                </Col>
                <Col md={4}>
                  <small className="text-muted">
                    Data Privacy:{" "}
                    <strong>
                      {CONFIG.ENABLE_DATA_PRIVACY_MODAL
                        ? "🔵 ENABLED"
                        : "⚫ DISABLED"}
                    </strong>
                  </small>
                </Col>
                <Col md={4}>
                  <small className="text-muted">
                    Form Access:{" "}
                    <strong>{formEnabled ? "✅ GRANTED" : "❌ PENDING"}</strong>
                  </small>
                </Col>
              </Row>
            </motion.div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  };

  // ==================== RENDER GUARDS ====================

  if (isMaintenance) {
    return <MaintenanceMode />;
  }

  // ==================== MAIN RENDER ====================

  return (
    <Container className="my-4">
      {/* Data Privacy Modal */}
      {CONFIG.ENABLE_DATA_PRIVACY_MODAL && (
        <DataPrivacyModal
          show={showDataPrivacyModal}
          onAccept={handleDataPrivacyAccept}
          onClose={handleDataPrivacyClose}
        />
      )}

      {/* Form Disabled Overlay */}
      {CONFIG.ENABLE_DATA_PRIVACY_MODAL && !formEnabled && (
        <div className="form-disabled-overlay">
          <Alert variant="warning" className="text-center">
            <h4>📋 Data Privacy Notice Required</h4>
            <p>
              Please read and accept the Data Privacy Act to access the form.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowDataPrivacyModal(true)}
            >
              Show Data Privacy Notice
            </Button>
          </Alert>
        </div>
      )}

      {/* Application Header */}
      <motion.h2
        className="mb-4 form-main-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AICS Application Form
      </motion.h2>

      {/* Error Display */}
      {submitError && (
        <Alert
          variant="danger"
          className="mb-3"
          onClose={() => setSubmitError("")}
          dismissible
        >
          <Alert.Heading>Submission Error</Alert.Heading>
          {submitError}
        </Alert>
      )}

      {/* Debug Tools */}
      {renderDebugTools()}

      {/* Main Form Content */}
      <div
        style={{
          opacity: !formEnabled && CONFIG.ENABLE_DATA_PRIVACY_MODAL ? 0.5 : 1,
          pointerEvents:
            !formEnabled && CONFIG.ENABLE_DATA_PRIVACY_MODAL ? "none" : "auto",
        }}
      >
        <Form onSubmit={handleReviewSubmit}>
          {/* Applicant/Guardian Information */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card-wrapper"
          >
            <Card className="mb-3 custom-card">
              <Card.Header className="custom-card-header">
                <motion.h5
                  className="mb-0"
                  variants={headerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <FaUser className="me-2" />
                  Applicant Information
                </motion.h5>
              </Card.Header>
              <Card.Body className="custom-card-body">
                <Row className="mb-4">
                  <Col md={3}>
                    <motion.div
                      custom={0}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Last Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="lastName"
                        value={client.lastName}
                        onChange={handleClientChange}
                        isInvalid={!!errors.lastName}
                        required
                        className="form-control-custom text-uppercase"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>
                  <Col md={3}>
                    <motion.div
                      custom={1}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        First Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="firstName"
                        value={client.firstName}
                        onChange={handleClientChange}
                        isInvalid={!!errors.firstName}
                        required
                        className="form-control-custom text-uppercase"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>
                  <Col md={3}>
                    <motion.div
                      custom={2}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Middle Name
                      </Form.Label>
                      <Form.Control
                        name="middleName"
                        value={client.middleName}
                        onChange={handleClientChange}
                        isInvalid={!!errors.middleName}
                        className="form-control-custom text-uppercase"
                        placeholder=""
                        onKeyPress={(e) => {
                          if (e.key === ".") {
                            e.preventDefault();
                          }
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.middleName}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>
                  <Col md={3}>
                    <motion.div
                      custom={3}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Extension Name
                      </Form.Label>
                      <Form.Select
                        name="extensionName"
                        value={client.extensionName}
                        onChange={handleClientChange}
                        className="form-select-custom"
                      >
                        <option value="">N/A</option>
                        <option value="Jr.">JR.</option>
                        <option value="Sr.">SR.</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                        <option value="V">V</option>
                        <option value="VI">VI</option>
                      </Form.Select>
                    </motion.div>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Label className="form-label-custom">
                      Province <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value="CAMARINES NORTE/051600000"
                      readOnly
                      className="form-control-custom bg-light"
                    />
                    <Form.Text className="form-text-custom">
                      Province is automatically set to Camarines Norte
                    </Form.Text>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label-custom">
                      Municipality/City <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="municipality"
                      value={client.municipality}
                      onChange={handleClientChange}
                      isInvalid={!!errors.municipality}
                      required
                      className="form-select-custom"
                    >
                      <option value="">Select Municipality/City</option>
                      {Object.keys(phLocations).map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.municipality}
                    </Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <motion.div
                      custom={2}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Barangay <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="barangay"
                        value={client.barangay}
                        onChange={handleClientChange}
                        disabled={!client.municipality}
                        isInvalid={!!errors.barangay}
                        required
                        className="form-select-custom"
                      >
                        <option value="">Select Barangay</option>
                        {client.municipality &&
                          phLocations[client.municipality]?.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.barangay}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label-custom">
                      Street/Purok/House No.
                    </Form.Label>
                    <Form.Control
                      name="street"
                      value={client.street}
                      onChange={handleClientChange}
                      placeholder="Street, Purok, or House Number"
                      className="form-control-custom text-uppercase"
                    />
                  </Col>
                </Row>

                {/* Birthdate Fields */}
                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Label className="form-label-custom">
                      Birthdate <span className="text-danger">*</span>
                    </Form.Label>
                    <motion.div
                      custom={0}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="birthdate-fields">
                        <Row>
                          <Col md={4}>
                            <Form.Select
                              name="birthMonth"
                              value={client.birthMonth}
                              onChange={handleClientChange}
                              isInvalid={!!errors.birthMonth}
                              required
                              className="form-select-custom text-uppercase"
                            >
                              <option value="">Month</option>
                              <option value="01">JANUARY</option>
                              <option value="02">FEBRUARY</option>
                              <option value="03">MARCH</option>
                              <option value="04">APRIL</option>
                              <option value="05">MAY</option>
                              <option value="06">JUNE</option>
                              <option value="07">JULY</option>
                              <option value="08">AUGUST</option>
                              <option value="09">SEPTEMBER</option>
                              <option value="10">OCTOBER</option>
                              <option value="11">NOVEMBER</option>
                              <option value="12">DECEMBER</option>
                            </Form.Select>
                          </Col>
                          <Col md={4}>
                            <Form.Select
                              name="birthDay"
                              value={client.birthDay}
                              onChange={handleClientChange}
                              isInvalid={!!errors.birthDay}
                              required
                              className="form-select-custom"
                            >
                              <option value="">Day</option>
                              {Array.from({ length: 31 }, (_, i) => {
                                const day = (i + 1).toString().padStart(2, "0");
                                return (
                                  <option key={day} value={day}>
                                    {i + 1}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </Col>
                          <Col md={4}>
                            <Form.Select
                              name="birthYear"
                              value={client.birthYear}
                              onChange={handleClientChange}
                              isInvalid={!!errors.birthYear}
                              required
                              className="form-select-custom"
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 85 }, (_, i) => {
                                const year = (1940 + i).toString();
                                return (
                                  <option key={year} value={year}>
                                    {1940 + i}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </Col>
                        </Row>
                      </div>
                      {(errors.birthMonth ||
                        errors.birthDay ||
                        errors.birthYear) && (
                        <motion.div
                          className="error-message"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          Please select complete birthdate
                        </motion.div>
                      )}
                    </motion.div>
                  </Col>

                  <Col md={4}>
                    <motion.div
                      custom={1}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Contact Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="contactNumber"
                        value={client.contactNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);
                          handleClientChange({
                            target: { name: "contactNumber", value: value },
                          });
                        }}
                        placeholder="09XXXXXXXXX"
                        isInvalid={!!errors.contactNumber}
                        required
                        maxLength={11}
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactNumber}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>

                  <Col md={4}>
                    <motion.div
                      custom={2}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        PSA National ID Number
                      </Form.Label>
                      <Form.Control
                        name="psaNationalId"
                        value={client.psaNationalId}
                        onChange={handleClientChange}
                        placeholder="12-digit number"
                        isInvalid={!!errors.psaNationalId}
                        maxLength={12}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.psaNationalId}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>
                </Row>

                {/* Gender, Civil Status, Occupation, Salary */}
                <Row className="mb-4">
                  <Col md={3}>
                    <motion.div
                      custom={3}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Gender <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="gender"
                        value={client.gender}
                        onChange={handleClientChange}
                        isInvalid={!!errors.gender}
                        required
                        className="form-select-custom"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.gender}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>

                  <Col md={3}>
                    <motion.div
                      custom={4}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Civil Status <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="civilStatus"
                        value={client.civilStatus}
                        onChange={handleClientChange}
                        isInvalid={!!errors.civilStatus}
                        required
                        className="form-select-custom"
                      >
                        <option value="">Select Civil Status</option>
                        <option value="SINGLE">SINGLE</option>
                        <option value="MARRIED">MARRIED</option>
                        <option value="SEPARATED">SEPARATED</option>
                        <option value="WIDOW/WIDOWER">WIDOW/WIDOWER</option>
                        <option value="COMMON-LAW">COMMON-LAW</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.civilStatus}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>

                  <Col md={3}>
                    <motion.div
                      custom={5}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Occupation <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="occupation"
                        value={client.occupation}
                        onChange={handleClientChange}
                        required
                        className="form-control-custom text-uppercase"
                      />
                    </motion.div>
                  </Col>

                  <Col md={3}>
                    <motion.div
                      custom={6}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Monthly Salary <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="monthlySalary"
                        value={client.monthlySalary}
                        required
                        onChange={handleClientChange}
                        placeholder="0.00"
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="form-control-custom"
                      />
                    </motion.div>
                  </Col>
                </Row>

                {/* Email and Relationship */}
                <Row>
                  <Col md={6}>
                    <motion.div
                      custom={8}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Form.Label className="form-label-custom">
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={client.email}
                        onChange={handleClientChange}
                        isInvalid={!!errors.email}
                        placeholder="example@email.com"
                        className="form-control-custom text-uppercase"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </motion.div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Family Information */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card-wrapper"
          >
            <Card className="mb-3 custom-card">
              <Card.Header className="custom-card-header">
                <motion.div
                  className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3"
                  variants={headerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="d-flex align-items-center">
                    <FaUsers className="me-2" size={20} />
                    <h5 className="mb-0">
                      Family Members
                      <span className="badge bg-light text-dark ms-2">
                        {familyMembers.length}/3
                      </span>
                    </h5>
                  </div>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={addMember}
                    disabled={familyMembers.length >= 3}
                    className="custom-btn"
                    style={{ minWidth: "140px" }}
                  >
                    <span className="d-flex align-items-center justify-content-center">
                      <span>+ Add Member</span>
                      <span className="d-md-none ms-2">
                        ({familyMembers.length}/3)
                      </span>
                    </span>
                  </Button>
                </motion.div>
              </Card.Header>
              <Card.Body className="custom-card-body">
                {familyMembers.map((member, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <Row className="mb-4 align-items-end family-member-row">
                      <Col md={2}>
                        <Form.Label className="form-label-custom">
                          Last Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          value={member.lastName}
                          onChange={(e) =>
                            handleMemberChange(idx, "lastName", e.target.value)
                          }
                          isInvalid={!!errors[`familyMember_${idx}_lastName`]}
                          className="form-control-custom text-uppercase"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[`familyMember_${idx}_lastName`]}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={2}>
                        <Form.Label className="form-label-custom">
                          First Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          value={member.firstName}
                          onChange={(e) =>
                            handleMemberChange(idx, "firstName", e.target.value)
                          }
                          isInvalid={!!errors[`familyMember_${idx}_firstName`]}
                          className="form-control-custom text-uppercase"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[`familyMember_${idx}_firstName`]}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={2}>
                        <Form.Label className="form-label-custom">
                          Middle Name
                        </Form.Label>
                        <Form.Control
                          value={member.middleName}
                          onChange={(e) =>
                            handleMemberChange(
                              idx,
                              "middleName",
                              e.target.value,
                            )
                          }
                          isInvalid={!!errors[`familyMember_${idx}_middleName`]}
                          className="form-control-custom text-uppercase"
                          placeholder=""
                          onKeyPress={(e) => {
                            if (e.key === ".") {
                              e.preventDefault();
                            }
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[`familyMember_${idx}_middleName`]}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={1}>
                        <Form.Label className="form-label-custom">
                          Extension
                        </Form.Label>
                        <Form.Select
                          value={member.extensionName}
                          onChange={(e) =>
                            handleMemberChange(
                              idx,
                              "extensionName",
                              e.target.value,
                            )
                          }
                          className="form-select-custom"
                        >
                          <option value="">N/A</option>
                          <option value="Jr.">JR.</option>
                          <option value="Sr.">SR.</option>
                          <option value="II">II</option>
                          <option value="III">III</option>
                          <option value="IV">IV</option>
                          <option value="V">V</option>
                          <option value="VI">VI</option>
                        </Form.Select>
                      </Col>
                      <Col md={1}>
                        <Form.Label className="form-label-custom">
                          Sex <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={member.gender}
                          onChange={(e) =>
                            handleMemberChange(idx, "gender", e.target.value)
                          }
                          isInvalid={!!errors[`familyMember_${idx}_gender`]}
                          required
                          className="form-select-custom"
                        >
                          <option value="">Select</option>
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors[`familyMember_${idx}_gender`]}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={1}>
                        <Form.Label className="form-label-custom">
                          Civil Status <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={member.civilStatus}
                          onChange={(e) =>
                            handleMemberChange(
                              idx,
                              "civilStatus",
                              e.target.value,
                            )
                          }
                          isInvalid={
                            !!errors[`familyMember_${idx}_civilStatus`]
                          }
                          required
                          className="form-select-custom"
                        >
                          <option value="">Select</option>
                          <option value="SINGLE">SINGLE</option>
                          <option value="MARRIED">MARRIED</option>
                          <option value="SEPARATED">SEPARATED</option>
                          <option value="WIDOW/WIDOWER">WIDOW/WIDOWER</option>
                          <option value="COMMON-LAW">COMMON-LAW</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors[`familyMember_${idx}_civilStatus`]}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={3}>
                        <Form.Label className="form-label-custom">
                          Birthdate <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="d-flex gap-2 birthdate-fields">
                          <div className="flex-fill">
                            <Form.Select
                              value={member.birthMonth}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "birthMonth",
                                  e.target.value,
                                )
                              }
                              isInvalid={
                                !!errors[`familyMember_${idx}_birthMonth`]
                              }
                              required
                              className="form-select-custom"
                            >
                              <option value="">Month</option>
                              <option value="01">Jan</option>
                              <option value="02">Feb</option>
                              <option value="03">Mar</option>
                              <option value="04">Apr</option>
                              <option value="05">May</option>
                              <option value="06">Jun</option>
                              <option value="07">Jul</option>
                              <option value="08">Aug</option>
                              <option value="09">Sep</option>
                              <option value="10">Oct</option>
                              <option value="11">Nov</option>
                              <option value="12">Dec</option>
                            </Form.Select>
                          </div>
                          <div className="flex-fill">
                            <Form.Select
                              value={member.birthDay}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "birthDay",
                                  e.target.value,
                                )
                              }
                              isInvalid={
                                !!errors[`familyMember_${idx}_birthDay`]
                              }
                              required
                              className="form-select-custom"
                            >
                              <option value="">Day</option>
                              {Array.from({ length: 31 }, (_, i) => {
                                const day = (i + 1).toString().padStart(2, "0");
                                return (
                                  <option key={day} value={day}>
                                    {i + 1}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </div>
                          <div className="flex-fill">
                            <Form.Select
                              value={member.birthYear}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "birthYear",
                                  e.target.value,
                                )
                              }
                              isInvalid={
                                !!errors[`familyMember_${idx}_birthYear`]
                              }
                              required
                              className="form-select-custom"
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 85 }, (_, i) => {
                                const year = (1940 + i).toString();
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </div>
                        </div>
                      </Col>
                      <Col md={2}>
                        <Form.Label className="form-label-custom">
                          Relationship <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={member.relationship}
                          onChange={(e) =>
                            handleMemberChange(
                              idx,
                              "relationship",
                              e.target.value,
                            )
                          }
                          isInvalid={
                            !!errors[`familyMember_${idx}_relationship`]
                          }
                          required
                          className="form-select-custom"
                        >
                          <option value="">Select</option>
                          <option value="SPOUSE">SPOUSE</option>
                          <option value="CHILD">CHILD</option>
                          <option value="PARENT">PARENT</option>
                          <option value="SIBLING">SIBLING</option>
                          <option value="GRANDPARENT">GRANDPARENT</option>
                          <option value="GRANDCHILD">GRANDCHILD</option>
                          <option value="RELATIVE">RELATIVE</option>
                          <option value="OTHER">OTHER</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors[`familyMember_${idx}_relationship`]}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={2}>
                        <Form.Label className="form-label-custom">
                          Occupation
                        </Form.Label>
                        <Form.Control
                          value={member.occupation}
                          onChange={(e) =>
                            handleMemberChange(
                              idx,
                              "occupation",
                              e.target.value,
                            )
                          }
                          className="form-control-custom text-uppercase"
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Label className="form-label-custom">
                          Monthly Salary
                        </Form.Label>
                        <Form.Control
                          value={member.salary}
                          onChange={(e) =>
                            handleMemberChange(idx, "salary", e.target.value)
                          }
                          placeholder="0.00"
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className="form-control-custom"
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Label className="form-label-custom">
                          Contact
                        </Form.Label>
                        <Form.Control
                          value={member.contactNumber}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 11);
                            handleMemberChange(idx, "contactNumber", value);
                          }}
                          placeholder="09..."
                          maxLength={11}
                          className="form-control-custom"
                        />
                      </Col>
                      <Col md={1}>
                        {familyMembers.length > 1 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => removeMember(idx)}
                            className="custom-btn"
                            size="sm"
                            title="Remove family member"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </motion.div>
                ))}
                {familyMembers.length >= 3 && (
                  <Alert variant="info" className="mt-2 custom-alert">
                    <small>Maximum of 3 family members allowed.</small>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!formEnabled && CONFIG.ENABLE_DATA_PRIVACY_MODAL}
              className="submit-btn-animated w-100"
            >
              <span className="btn-content">
                <span className="btn-text">Review & Submit My Application</span>
                <span className="btn-arrow-wrapper">
                  <FaArrowRight className="btn-arrow" />
                </span>
              </span>
              <span className="btn-shine"></span>
            </Button>
          </motion.div>
        </Form>
      </div>

      {/* Review Modal */}
      <Modal
        show={showModal}
        onHide={() => !isSubmitting && setShowModal(false)}
        size="lg"
        className="custom-modal"
      >
        <Modal.Header
          closeButton={!isSubmitting}
          className="custom-card-header"
        >
          <Modal.Title className="text-white mb-0">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="d-flex align-items-center"
            >
              <FaFileAlt className="me-2" />
              Review Your Information
            </motion.span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="custom-card-body review-modal-body">
          {submitError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert variant="danger" className="custom-alert">
                <Alert.Heading>Submission Error</Alert.Heading>
                {submitError}
              </Alert>
            </motion.div>
          )}

          {/* Applicant Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="review-section">
              <h5 className="section-title">
                <FaUser className="me-2" />
                Applicant Information
              </h5>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaUser className="me-1" size={12} />
                      Full Name:
                    </strong>
                    <span className="info-value">{getApplicantFullName()}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaBirthdayCake className="me-1" size={12} />
                      Birthdate:
                    </strong>
                    <span className="info-value">
                      {formatApplicantBirthdate()}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaVenusMars className="me-1" size={12} />
                      Gender:
                    </strong>
                    <span className="info-value">{client.gender}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaHeart className="me-1" size={12} />
                      Civil Status:
                    </strong>
                    <span className="info-value">{client.civilStatus}</span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaBriefcase className="me-1" size={12} />
                      Occupation:
                    </strong>
                    <span className="info-value">
                      {client.occupation || "Not provided"}
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaMoneyBill className="me-1" size={12} />
                      Monthly Salary:
                    </strong>
                    <span className="info-value">
                      {client.monthlySalary
                        ? `₱${parseFloat(client.monthlySalary).toLocaleString()}`
                        : "Not provided"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="review-section">
              <h5 className="section-title">
                <FaPhone className="me-2" />
                Contact Information
              </h5>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaPhone className="me-1" size={12} />
                      Contact Number:
                    </strong>
                    <span className="info-value">{client.contactNumber}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaEnvelope className="me-1" size={12} />
                      Email:
                    </strong>
                    <span className="info-value">
                      {client.email || "Not provided"}
                    </span>
                  </div>
                </Col>
              </Row>
              {client.psaNationalId && (
                <Row className="mb-3">
                  <Col md={12}>
                    <div className="info-item">
                      <strong className="info-label">
                        <FaIdCard className="me-1" size={12} />
                        PSA National ID:
                      </strong>
                      <span className="info-value">{client.psaNationalId}</span>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </motion.div>

          {/* Address Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="review-section">
              <h5 className="section-title">
                <FaHome className="me-2" />
                Address Information
              </h5>
              <Row className="mb-3">
                <Col md={12}>
                  <div className="info-item">
                    <strong className="info-label">
                      <FaHome className="me-1" size={12} />
                      Complete Address:
                    </strong>
                    <span className="info-value">
                      {[
                        client.street,
                        client.barangay,
                        client.municipality,
                        client.province,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </motion.div>

          {/* Family Members Section */}
          {familyMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="review-section">
                <h5 className="section-title">
                  <FaUsers className="me-2" />
                  Family Members ({familyMembers.length})
                </h5>
                {familyMembers.map((member, idx) => {
                  const memberBirthdate =
                    member.birthYear && member.birthMonth && member.birthDay
                      ? formatFamilyMemberDate(
                          member.birthYear,
                          member.birthMonth,
                          member.birthDay,
                        )
                      : "Not provided";

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <Card className="mb-3 custom-card family-member-card">
                        <Card.Header className="custom-card-header family-member-header">
                          <h6 className="mb-0 text-white d-flex align-items-center">
                            <FaUser className="me-2" />
                            {[
                              member.lastName,
                              member.firstName,
                              member.middleName,
                              member.extensionName,
                            ]
                              .filter(Boolean)
                              .join(" ")
                              .toUpperCase()}
                          </h6>
                        </Card.Header>
                        <Card.Body className="custom-card-body">
                          <Row>
                            <Col md={8}>
                              <div className="info-item">
                                <strong className="info-label">
                                  <FaUsers className="me-1" size={12} />
                                  Relationship:
                                </strong>
                                <span className="info-value">
                                  {member.relationship}
                                </span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className="info-item">
                                <strong className="info-label">
                                  <FaVenusMars className="me-1" size={12} />
                                  Gender:
                                </strong>
                                <span className="info-value">
                                  {member.gender || "Not provided"}
                                </span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className="info-item">
                                <strong className="info-label">
                                  <FaHeart className="me-1" size={12} />
                                  Civil Status:
                                </strong>
                                <span className="info-value">
                                  {member.civilStatus || "Not provided"}
                                </span>
                              </div>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col>
                              <div className="info-item">
                                <strong className="info-label">
                                  <FaBirthdayCake className="me-1" size={12} />
                                  Birthdate:
                                </strong>
                                <span className="info-value">
                                  {memberBirthdate}
                                </span>
                              </div>
                            </Col>
                            <Col>
                              <div className="info-item">
                                <strong className="info-label">
                                  <FaPhone className="me-1" size={12} />
                                  Contact:
                                </strong>
                                <span className="info-value">
                                  {member.contactNumber || "Not provided"}
                                </span>
                              </div>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col md={6}>
                              <div className="info-item">
                                <strong className="info-label">
                                  <FaBriefcase className="me-1" size={12} />
                                  Occupation:
                                </strong>
                                <span className="info-value">
                                  {member.occupation || "Not provided"}
                                </span>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="info-item">
                                <strong className="info-label">
                                  <FaMoneyBill className="me-1" size={12} />
                                  Monthly Salary:
                                </strong>
                                <span className="info-value">
                                  {member.salary
                                    ? `₱${parseFloat(member.salary).toLocaleString()}`
                                    : "Not provided"}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </Modal.Body>

        <Modal.Footer className="custom-card-footer">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-100 d-flex gap-3"
          >
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
              className="custom-btn flex-fill"
              size="lg"
            >
              <FaEdit className="me-2" />
              Go Back and Edit
            </Button>
            <Button
              variant="primary"
              onClick={handleProceedToConfirmation}
              disabled={isSubmitting}
              className="custom-btn flex-fill submit-confirm-btn"
              size="lg"
            >
              <FaCheck className="me-2" />
              Proceed to Submit
            </Button>
          </motion.div>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <ErrorModal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
        errors={errorModalData.errors}
      />

      {/* Progress Modal */}
      <Modal
        show={showProgressModal}
        centered
        size="sm"
        className="custom-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="custom-card-header">
          <Modal.Title className="text-white mb-0">
            <span className="d-flex align-items-center">
              <FaSpinner className="me-2 spin" />
              Submitting...
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-card-body text-center">
          <div className="d-flex align-items-center justify-content-center">
            <div>
              <h6 className="mb-1">Processing your application</h6>
              <p className="text-muted small mb-0">
                This may take a few moments...
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => !isSubmitting && setShowConfirmationModal(false)}
        onConfirm={handleFinalSubmit}
        isSubmitting={isSubmitting}
        title="Confirm Submission"
        message="Are you sure you want to submit your application data now? This action cannot be undone."
        confirmText="Yes, Submit Now"
        cancelText="No, Go Back"
      />
    </Container>
  );
}
