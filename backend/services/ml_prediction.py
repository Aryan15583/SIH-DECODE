"""
Autonomous SOC Threat Prediction Service (ML Demonstration Model)
-----------------------------------------------------------------
NOTE: This is a safe, lightweight scikit-learn demonstration model developed for
educational and SIH evaluation purposes. It is trained on synthetic security feature
vectors to dynamically predict threat categories, probability scores, risk tiers, and
attacker progression trends based on live telemetry inputs.
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, Any, List
from utils.logger import get_logger

logger = get_logger("ml_prediction")

# Mapping categories
CATEGORY_NAMES = [
    "Reconnaissance",
    "Credential Abuse",
    "Malware Execution",
    "Lateral Movement",
    "Data Exfiltration"
]

CATEGORY_INDEX = {name.lower(): i for i, name in enumerate(CATEGORY_NAMES)}

class MLThreatPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self._is_trained = False
        self._train_demo_model()

    def _train_demo_model(self):
        """
        Trains a demonstration Random Forest Classifier on synthetic threat feature data.
        Features:
        [severity_weight (1-4), confidence (0-1), event_count, failed_logins, affected_assets, category_code (0-4), alert_freq]
        """
        np.random.seed(42)
        samples_per_class = 60
        X_train = []
        y_train = []

        for class_idx in range(5):
            for _ in range(samples_per_class):
                if class_idx == 0:  # Reconnaissance
                    sev = np.random.choice([1, 2], p=[0.7, 0.3])
                    conf = np.random.uniform(0.60, 0.85)
                    events = np.random.randint(5, 30)
                    failed = np.random.randint(0, 3)
                    assets = np.random.randint(1, 3)
                    cat_code = 0
                    freq = np.random.randint(1, 10)
                elif class_idx == 1:  # Credential Abuse
                    sev = np.random.choice([2, 3, 4], p=[0.2, 0.5, 0.3])
                    conf = np.random.uniform(0.75, 0.95)
                    events = np.random.randint(10, 50)
                    failed = np.random.randint(3, 20)
                    assets = np.random.randint(1, 4)
                    cat_code = 1
                    freq = np.random.randint(3, 15)
                elif class_idx == 2:  # Malware Execution
                    sev = np.random.choice([3, 4], p=[0.3, 0.7])
                    conf = np.random.uniform(0.85, 0.99)
                    events = np.random.randint(5, 40)
                    failed = np.random.randint(0, 5)
                    assets = np.random.randint(1, 5)
                    cat_code = 2
                    freq = np.random.randint(2, 12)
                elif class_idx == 3:  # Lateral Movement
                    sev = np.random.choice([3, 4], p=[0.4, 0.6])
                    conf = np.random.uniform(0.80, 0.95)
                    events = np.random.randint(15, 60)
                    failed = np.random.randint(2, 10)
                    assets = np.random.randint(3, 10)
                    cat_code = 3
                    freq = np.random.randint(5, 20)
                else:  # Data Exfiltration
                    sev = np.random.choice([3, 4], p=[0.2, 0.8])
                    conf = np.random.uniform(0.88, 0.99)
                    events = np.random.randint(20, 80)
                    failed = np.random.randint(0, 4)
                    assets = np.random.randint(2, 8)
                    cat_code = 4
                    freq = np.random.randint(4, 25)

                X_train.append([sev, conf, events, failed, assets, cat_code, freq])
                y_train.append(class_idx)

        X = np.array(X_train)
        y = np.array(y_train)
        self.model.fit(X, y)
        self._is_trained = True
        logger.info("Demonstration ML Threat Prediction model initialized and trained successfully.")

    def predict(
        self,
        severity: str = "Medium",
        confidence: float = 0.85,
        event_count: int = 5,
        failed_logins: int = 0,
        affected_assets: int = 1,
        category: str = "Reconnaissance",
        alert_frequency: int = 2
    ) -> Dict[str, Any]:
        """
        Runs ML inference on incoming event & alert telemetry features.
        """
        sev_map = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
        sev_weight = sev_map.get(severity, 2)
        norm_conf = confidence / 100.0 if confidence > 1.0 else confidence

        cat_code = CATEGORY_INDEX.get(category.lower(), 0)

        feature_vector = np.array([[
            sev_weight,
            norm_conf,
            event_count,
            failed_logins,
            affected_assets,
            cat_code,
            alert_frequency
        ]])

        probs = self.model.predict_proba(feature_vector)[0]
        pred_class_idx = int(np.argmax(probs))
        predicted_category = CATEGORY_NAMES[pred_class_idx]
        top_probability = float(probs[pred_class_idx])

        # Determine risk level
        if top_probability > 0.85 or sev_weight >= 4:
            risk_level = "Critical"
            trend = "up"
        elif top_probability > 0.65 or sev_weight >= 3:
            risk_level = "High"
            trend = "up" if event_count > 10 else "flat"
        elif top_probability > 0.45 or sev_weight >= 2:
            risk_level = "Medium"
            trend = "flat"
        else:
            risk_level = "Low"
            trend = "down"

        # Probability breakdown per category
        breakdown = {CATEGORY_NAMES[i]: round(float(probs[i]) * 100, 1) for i in range(len(CATEGORY_NAMES))}

        return {
            "model_type": "Scikit-Learn Random Forest (Demonstration)",
            "predicted_threat": predicted_category,
            "confidence": round(top_probability * 100, 1),
            "risk_level": risk_level,
            "trend": trend,
            "probabilities": breakdown,
            "features_analyzed": {
                "severity_weight": sev_weight,
                "confidence_score": norm_conf,
                "event_count": event_count,
                "failed_logins": failed_logins,
                "affected_assets": affected_assets,
                "category": category,
                "alert_frequency": alert_frequency
            }
        }

    def get_dashboard_predictions(
        self,
        recent_alert_count: int = 5,
        critical_count: int = 1,
        active_incidents: int = 2
    ) -> List[Dict[str, Any]]:
        """
        Generates dynamic dashboard prediction items expected by the frontend:
        [ { "label": str, "probability": int, "trend": "up" | "down" | "flat" } ]
        """
        # Run ML inference on dynamic security states
        p_lateral = self.predict(
            severity="High" if critical_count > 0 else "Medium",
            confidence=0.90,
            event_count=recent_alert_count * 3,
            failed_logins=active_incidents * 2,
            affected_assets=max(1, active_incidents + 1),
            category="Lateral Movement",
            alert_frequency=recent_alert_count
        )

        p_exfil = self.predict(
            severity="Critical" if critical_count > 1 else "High",
            confidence=0.82,
            event_count=recent_alert_count * 2,
            failed_logins=1,
            affected_assets=max(1, active_incidents),
            category="Data Exfiltration",
            alert_frequency=recent_alert_count
        )

        p_privilege = self.predict(
            severity="High",
            confidence=0.75,
            event_count=recent_alert_count,
            failed_logins=active_incidents * 3,
            affected_assets=1,
            category="Credential Abuse",
            alert_frequency=recent_alert_count
        )

        return [
            {
                "label": "Lateral Movement",
                "probability": int(p_lateral["confidence"]),
                "trend": p_lateral["trend"]
            },
            {
                "label": "Data Exfiltration Attempt",
                "probability": int(p_exfil["confidence"]),
                "trend": p_exfil["trend"]
            },
            {
                "label": "Privilege Escalation",
                "probability": int(p_privilege["confidence"]),
                "trend": p_privilege["trend"]
            }
        ]

# Singleton instance
ml_predictor = MLThreatPredictor()
