import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Voice & Audio Processing`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`The Sound of AI.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 Voice provides specialized kernels and model presets for high-performance audio processing, speech-to-text, and real-time synthesis.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Low-Latency Audio Substrate`}),`
`,(0,t.jsx)(n.p,{children:`Processing audio in real-time requires deterministic performance and ultra-low latency. NEF2 Voice implements core signal processing primitives as hardware-accelerated kernels, ensuring that your audio pipelines can keep up with high-fidelity streams.`}),`
`,(0,t.jsx)(n.h2,{children:`Core Audio Primitives`}),`
`,(0,t.jsx)(n.h3,{children:`Fast Fourier Transform (FFT)`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 includes highly optimized FFT and STFT kernels (via cuFFT, clFFT, and Accelerate) for rapid frequency-domain analysis.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2 import voice

# Perform a high-speed Short-Time Fourier Transform
spectrogram = voice.stft(audio_tensor, n_fft=2048, hop_length=512)
`})}),`
`,(0,t.jsx)(n.h3,{children:`Spectrogram Processing`}),`
`,(0,t.jsx)(n.p,{children:`Native support for Mel-spectrograms, MFCCs, and other common audio features, implemented as fused kernels to minimize memory transfers.`}),`
`,(0,t.jsx)(n.h2,{children:`Speech Model Presets`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 Voice comes with pre-trained and optimized architectures for modern voice tasks:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Whisper-NEF`}),`: A high-performance implementation of the Whisper architecture, utilizing `,(0,t.jsx)(n.strong,{children:`FlashAttention`}),` and `,(0,t.jsx)(n.strong,{children:`TurboQuant`}),` for 5x faster transcription than standard implementations.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Tacotron & FastSpeech`}),`: Optimized synthesis backends for real-time text-to-speech.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Wav2Vec 2.0`}),`: Foundation models for audio representation learning.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Real-Time Audio Streaming`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.voice.stream`}),` API allows for the seamless integration of live audio buffers into the NEF pipeline. By utilizing the `,(0,t.jsx)(n.strong,{children:`Shared Tensor Bus`}),`, audio data can be processed by multiple agents (e.g., transcription -> translation -> synthesis) without any serialization overhead.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.voice import AudioStream

# Initialize a low-latency stream from the system microphone
with AudioStream(sample_rate=16000) as stream:
    for chunk in stream:
        # Process audio chunk directly as a nef2.Tensor
        text = whisper_model(chunk)
        print(f"Heard: {text}")
`})}),`
`,(0,t.jsx)(n.h2,{children:`Psychoacoustic Compression`}),`
`,(0,t.jsx)(n.p,{children:`For large-scale audio datasets, NEF2 Voice includes psychoacoustic quantization techniques that reduce the bit-depth of audio tensors while preserving the features critical for model performance, effectively doubling your effective audio storage capacity.`}),`
`,(0,t.jsx)(n.p,{children:`By providing a dedicated substrate for sound, NEF2 Voice enables the creation of truly conversational and responsive AI systems.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};