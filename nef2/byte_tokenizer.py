class ByteTokenizer:
    vocab_size = 256

    def encode(self, text):
        if isinstance(text, str):
            return list(text.encode("utf-8"))
        return [int(item) for item in text]

    def decode(self, ids):
        return bytes(int(item) % 256 for item in ids).decode("utf-8", errors="replace")
