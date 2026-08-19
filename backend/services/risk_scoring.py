class RiskScoringService:
    @staticmethod
    def calculate_score(
        severity: str,
        confidence_score: float,  # 0.0 to 1.0 or 0 to 100
        num_affected_assets: int = 1,
        num_related_alerts: int = 1,
        category: str = "General"
    ) -> int:
        """
        Calculate a risk score between 0 and 100.
        
        Formula elements:
        1. Severity Base:
           - Critical: 40 points
           - High: 30 points
           - Medium: 20 points
           - Low: 10 points
        2. Confidence Contribution:
           - normalized confidence (0 to 1.0) * 20 points
        3. Asset Impact:
           - 5 points per affected asset (up to 15 points max)
        4. Threat Volume:
           - 3 points per related alert (up to 15 points max)
        5. Category weighting:
           - Malware / Credential Abuse: 10 points
           - Access Anomalies / Port Scan: 5 points
           - Others: 0 points
        """
        score = 0
        
        # 1. Severity Base
        sev_map = {
            "Critical": 40,
            "High": 30,
            "Medium": 20,
            "Low": 10
        }
        score += sev_map.get(severity, 10)
        
        # 2. Confidence Contribution
        # Support both 0-1 and 0-100 confidence scales
        conf = confidence_score / 100.0 if confidence_score > 1.0 else confidence_score
        score += int(conf * 20)
        
        # 3. Asset Impact
        score += min(num_affected_assets * 5, 15)
        
        # 4. Threat Volume
        score += min(num_related_alerts * 3, 15)
        
        # 5. Category Weighting
        cat = category.lower()
        if "malware" in cat or "credential" in cat or "dumping" in cat:
            score += 10
        elif "scan" in cat or "failed" in cat or "anomaly" in cat:
            score += 5
            
        # Bound score between 0 and 100
        return max(0, min(100, score))

    @staticmethod
    def get_tier(score: int) -> str:
        """
        Classifies risk score into standard SOC tiers.
        """
        if score <= 25:
            return "Low"
        elif score <= 50:
            return "Medium"
        elif score <= 75:
            return "High"
        else:
            return "Critical"
