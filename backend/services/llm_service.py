import os
import json
import httpx
from typing import Dict, Any, List
from dotenv import load_dotenv
from utils.logger import get_logger

load_dotenv()
logger = get_logger("llm_service")

class LLMService:
    def __init__(self):
        # Support both LLM_API_KEY and GEMINI_API_KEY environment variables
        self.api_key = os.getenv("LLM_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.has_real_llm = bool(self.api_key)
        if self.has_real_llm:
            logger.info("Real LLM Integration enabled using Gemini API.")
        else:
            logger.info("Real LLM Integration disabled (no API key found). Using mock threat analyst simulator.")

    def analyze_alert(self, alert_title: str, category: str, source_ip: str, affected_asset: str) -> Dict[str, Any]:
        """
        Provides AI analysis of a specific security alert using Gemini 1.5 Flash if API key is present.
        """
        if self.has_real_llm:
            try:
                # System prompt instructions requesting JSON schema matching the contract
                prompt = f"""
                You are AegisSOC AI, a senior security operations center AI analyst.
                Perform a threat analysis on the following security alert:
                - Alert Title: {alert_title}
                - Category: {category}
                - Source IP: {source_ip}
                - Affected Asset: {affected_asset}

                Provide your analysis as a JSON object matching this exact schema:
                {{
                  "threat_type": "string (name of threat type)",
                  "severity": "string (Low, Medium, High, or Critical)",
                  "confidence": "float (confidence rating between 0.0 and 1.0)",
                  "explanation": "string (1-2 sentence detailed cyber analysis explaining what happened)",
                  "recommendations": ["list", "of", "3", "remediation", "actions"]
                }}
                """

                # Call Gemini API using httpx (zero external SDK dependencies for Python 3.14 safety)
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "responseMimeType": "application/json"
                    }
                }
                
                response = httpx.post(url, json=payload, timeout=15.0)
                if response.status_code == 200:
                    result = response.json()
                    text_content = result["candidates"][0]["content"]["parts"][0]["text"]
                    analysis = json.loads(text_content)
                    
                    # Ensure all required keys exist in response
                    required_keys = ["threat_type", "severity", "confidence", "explanation", "recommendations"]
                    if all(key in analysis for key in required_keys):
                        return analysis
                    else:
                        logger.warning("Gemini JSON was missing required fields, falling back to mock.")
                else:
                    logger.error(f"Gemini API returned status {response.status_code}: {response.text}")
            except Exception as e:
                logger.error(f"Error querying Gemini API: {e}. Falling back to mock threat analyst.")

        # Fallback Mock Responses
        category_lower = category.lower()
        title_lower = alert_title.lower()
        
        if "brute" in category_lower or "failed" in title_lower:
            return {
                "threat_type": "Brute Force Attack",
                "severity": "High",
                "confidence": 0.94,
                "explanation": f"A high volume of failed authentication attempts was observed from source IP {source_ip} targeting account credentials on host {affected_asset}. This is highly indicative of automated password-guessing attempts.",
                "recommendations": [
                    f"Simulate blocking ingress traffic from IP {source_ip}.",
                    f"Audit active sessions on {affected_asset} for successful logins.",
                    "Enforce multi-factor authentication (MFA) and lock target accounts temporarily."
                ]
            }
        elif "malware" in category_lower or "trojan" in title_lower or "ransomware" in title_lower:
            return {
                "threat_type": "Malware Infiltration",
                "severity": "Critical",
                "confidence": 0.96,
                "explanation": f"A known malicious file signature or execution pattern was detected on asset {affected_asset}. The system flagged unauthorized registry edits and outbound network requests to a suspected command-and-control server.",
                "recommendations": [
                    f"Isolate the endpoint {affected_asset} from the network.",
                    "Trigger a simulated full-disk malware scan on the host.",
                    "Harvest memory dumps and execution logs for reverse engineering."
                ]
            }
        elif "scan" in category_lower or "recon" in category_lower:
            return {
                "threat_type": "Reconnaissance (Port Scan)",
                "severity": "Medium",
                "confidence": 0.88,
                "explanation": f"Source IP {source_ip} performed sequential TCP/UDP port connection attempts across a broad range of ports on {affected_asset}. This indicates scanning activity aimed at mapping open ports and identifying active network services.",
                "recommendations": [
                    "Monitor for subsequent exploitation or lateral movement attempts.",
                    f"Create a simulated firewall rule to restrict communication with {source_ip}.",
                    "Ensure non-essential services on the target systems are disabled."
                ]
            }
        elif "credential" in category_lower or "privilege" in title_lower:
            return {
                "threat_type": "Credential Abuse & Privilege Escalation",
                "severity": "Critical",
                "confidence": 0.92,
                "explanation": f"Anomalous administrative login detected on {affected_asset}. The authentication lease was requested outside of standard working hours and utilized credentials historically associated with inactive user sessions.",
                "recommendations": [
                    "Revoke DB Account Permissions and force password resets.",
                    "Verify the legitimacy of the activity with the account owner.",
                    "Isolate database or target servers to prevent data exfiltration."
                ]
            }
        else:
            return {
                "threat_type": "Anomalous Activity Detected",
                "severity": "Medium",
                "confidence": 0.80,
                "explanation": f"Security operations flagged an unusual traffic pattern or log message on {affected_asset} originating from {source_ip}. While not mapping directly to known malicious signatures, it departs significantly from established baseline behavior.",
                "recommendations": [
                    "Initiate detailed activity logging for the source IP.",
                    "Verify asset software updates and configurations.",
                    "Review recent firewall logs for associated egress traffic."
                ]
            }

    def generate_incident_summary(self, incident_title: str, status: str, risk_score: int, alerts_count: int) -> str:
        """
        Generates an AI summary of an ongoing security incident.
        """
        return (
            f"Autonomous investigation suggests a correlated threat vector labeled '{incident_title}'. "
            f"Currently in '{status}' status with a calculated risk index of {risk_score}/100. "
            f"The incident links {alerts_count} active security alert(s) across EDR and network sensors. "
            "Automated containment procedures are ready to run."
        )

    def recommend_actions(self, attack_type: str) -> List[str]:
        """
        Suggests containment and remediation actions.
        """
        attack_lower = attack_type.lower()
        if "brute" in attack_lower:
            return ["Block Attacker IP", "Lock Target Account", "Review Event Logs"]
        elif "malware" in attack_lower:
            return ["Isolate Endpoint", "Reset Credentials", "Collect Process Evidence"]
        elif "credential" in attack_lower:
            return ["Revoke Permissions", "Force Password Reset", "Collect DB Audits"]
        else:
            return ["Isolate Host", "Block Traffic Egress", "Generate Incident Report"]
