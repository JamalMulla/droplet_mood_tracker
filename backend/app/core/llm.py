from anthropic import Anthropic
from app.core.config import settings
from typing import Optional


class LLMClient:
    """Wrapper for LLM API calls (Anthropic Claude)"""

    def __init__(self):
        if not settings.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not set in environment")

        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.llm_model

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = None,
        max_tokens: int = None,
    ) -> str:
        """
        Generate text using Claude API

        Args:
            prompt: User prompt
            system_prompt: System instructions
            temperature: Randomness (0-1)
            max_tokens: Max response length

        Returns:
            Generated text
        """
        if temperature is None:
            temperature = settings.llm_temperature
        if max_tokens is None:
            max_tokens = settings.llm_max_tokens

        kwargs = {
            "model": self.model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}],
        }

        if system_prompt:
            kwargs["system"] = system_prompt

        response = self.client.messages.create(**kwargs)

        return response.content[0].text


# Global instance
llm_client = LLMClient()
