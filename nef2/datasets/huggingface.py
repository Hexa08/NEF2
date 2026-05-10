import json
import urllib.parse
import urllib.request


class HuggingFaceRows:
    def __init__(self, dataset, config, split="train", timeout=60):
        self.dataset = dataset
        self.config = config
        self.split = split
        self.timeout = timeout

    def rows(self, offset=0, batch_size=100, limit=None):
        seen = 0
        while limit is None or seen < limit:
            length = batch_size if limit is None else min(batch_size, limit - seen)
            if length <= 0:
                break
            page = self._fetch(offset + seen, length)
            rows = page.get("rows", [])
            if not rows:
                break
            for item in rows:
                yield item["row"]
                seen += 1
                if limit is not None and seen >= limit:
                    break

    def _fetch(self, offset, length):
        params = urllib.parse.urlencode(
            {
                "dataset": self.dataset,
                "config": self.config,
                "split": self.split,
                "offset": offset,
                "length": length,
            }
        )
        url = "https://datasets-server.huggingface.co/rows?" + params
        req = urllib.request.Request(url, headers={"User-Agent": "nef2/0.1"})
        with urllib.request.urlopen(req, timeout=self.timeout) as response:
            return json.load(response)


def wikipedia_text(config="20231101.en", split="train", limit=None, batch_size=100):
    dataset = HuggingFaceRows("wikimedia/wikipedia", config=config, split=split)
    for row in dataset.rows(batch_size=batch_size, limit=limit):
        text = row.get("text", "")
        if text:
            yield text
