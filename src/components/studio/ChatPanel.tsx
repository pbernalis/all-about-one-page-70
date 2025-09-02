import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Send, Sparkles, Bot, User, Loader2, Palette, Type, Plus, Eye, Trash2, Download, LogIn, Volume2, VolumeX, MessageSquare, Settings } from 'lucide-react';
import { StudioSchema } from '@/types/schema';
import { useChatHistory, type ChatMessage } from '@/hooks/useChatHistory';
import { useAuth } from '@/contexts/AuthContext';
import { MessageActions } from './MessageActions';
import { ChangesModal } from './ChangesModal';
import { enrichPatchOps, type JsonPatchOp } from '@/cms/ai/enrichPatchOps';
import { supabaseRemote } from '@/cms/ai/remote.supabase';
import CloudSyncBadge from './CloudSyncBadge';
import AuthModal from '@/components/auth/AuthModal';
import MicButton from '@/components/chat/MicButton';
import { speak, stopSpeaking, isSpeakingSupported } from '@/utils/tts';

interface ChatPanelProps {
  siteSlug: string;
  siteId?: string;
  schema: StudioSchema | null;
  onSchemaUpdate: (schema: StudioSchema) => void;
  onGenerate: (prompt: string) => Promise<void>;
  onEdit: (instruction: string, history: any[]) => Promise<void>;
  onApply?: (payload: { 
    type: "patches" | "schema"; 
    patches?: any[]; 
    schema?: any; 
    note?: string; 
  }) => Promise<void>;
}

const quickActions = [
  { id: 'color', label: 'Change brand color', icon: Palette, category: 'style', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'testimonials', label: 'Add testimonials', icon: Plus, category: 'content', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { id: 'bold', label: 'Make title bold', icon: Type, category: 'typography', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  { id: 'preview', label: 'Add image preview', icon: Eye, category: 'media', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
];

export const ChatPanel: React.FC<ChatPanelProps> = ({ siteSlug, siteId, schema, onSchemaUpdate, onGenerate, onEdit, onApply }) => {
  const { user } = useAuth();
  // Use site-scoped project key for chat history
  const projectKey = siteId || siteSlug;
  const pageKey = schema?.layout || 'default';

  const { 
    messages, 
    loading: historyLoading, 
    addMessage, 
    clearHistory, 
    linkLocalToRemote,
    canLinkNow
  } = useChatHistory(
    projectKey,
    pageKey,
    {
      keep: 200,
      remote: supabaseRemote,
      autosync: true,
      linkLocalOnFirstSignIn: true,
      linkMax: 500,
    }
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [changesForView, setChangesForView] = useState<unknown[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [linking, setLinking] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const [autoLinkedOnce, setAutoLinkedOnce] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voiceMode, setVoiceMode] = useState<"toggle" | "hold">("toggle");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  // Debounced auto-link to prevent double runs during HMR or auth transitions
  const debouncedAutoLink = useMemo(() => {
    let timer: number | undefined;
    return (fn: () => Promise<void>, ms = 800) => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(fn, ms);
    };
  }, []);

  // Auto-link local to remote on first sign-in (debounced + one-time flag)
  useEffect(() => {
    if (!user || !messages.length || autoLinkedOnce || !canLinkNow) return;
    
    debouncedAutoLink(async () => {
      try {
        const linkedCount = await linkLocalToRemote();
        if (linkedCount > 0) {
          setLastSyncAt(Date.now());
          toast({
            title: "Cloud sync active",
            description: `Auto-linked ${linkedCount} message${linkedCount === 1 ? "" : "s"} to your account.`,
          });
        }
      } finally {
        setAutoLinkedOnce(true); // Don't fire again until reload
      }
    }, 800);
  }, [user, messages.length, linkLocalToRemote, autoLinkedOnce, canLinkNow, debouncedAutoLink]);

  // Handle manual link now with toast feedback
  const handleLinkNow = async () => {
    if (!user || linking) return;
    try {
      setLinking(true);
      const linkedCount = await linkLocalToRemote();
      setLastSyncAt(Date.now());

      if (linkedCount > 0) {
        toast({
          title: "Cloud sync complete",
          description: `Linked ${linkedCount} message${linkedCount === 1 ? "" : "s"} to your account.`,
        });
      } else {
        toast({
          title: "Already in sync",
          description: "No local-only messages were found.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Link failed",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLinking(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ 
          top: scrollContainer.scrollHeight, 
          behavior: 'smooth' 
        });
      }
    }
  }, [messages]);

  // Text-to-Speech για AI απαντήσεις
  useEffect(() => {
    if (!ttsEnabled || !isSpeakingSupported()) return;
    
    const lastAssistantMessage = messages
      .filter(m => m.role === 'assistant')
      .pop();
    
    if (lastAssistantMessage && lastAssistantMessage.content && !isLoading) {
      // Μικρή καθυστέρηση για να μη διακοπεί από loading states
      const timer = setTimeout(() => {
        speak(lastAssistantMessage.content, "el-GR");
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [messages, ttsEnabled, isLoading]);

  // Καθαρισμός TTS όταν φεύγουμε
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Determine whether to generate or edit
  const shouldGenerate = (prompt: string): boolean => {
    if (!schema) return true;
    const generateKeywords = ['create', 'build', 'generate', 'make', 'start'];
    const lowerPrompt = prompt.toLowerCase();
    return generateKeywords.some(keyword => lowerPrompt.includes(keyword));
  };

  // Handle generate (first-time create)
  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    const previousSchema = schema;
    
    // Add thinking message
    const thinkingId = addMessage('assistant', 'Generating your page layout and content...');

    try {
      await onGenerate(prompt);
      // Create patch operations for generation
      const patchOps = [{ 
        op: 'replace', 
        path: '', 
        value: 'Generated new page layout',
        instruction: prompt,
        timestamp: Date.now()
      }];
      
      // Add success message with proper data for actions
      addMessage('assistant', 'Page generated successfully! Your new layout is ready in the canvas.', patchOps, schema);
      
      toast({
        title: "Page generated",
        description: "Your new layout is ready in the canvas.",
      });
    } catch (error) {
      addMessage('assistant', 'Generation failed. Please try again or refine your request.');
      toast({
        title: "Generation failed",
        description: "Please try again or refine your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit (iterative changes)
  const handleEditRequest = async (instruction: string) => {
    setIsLoading(true);
    const schemaBefore = schema ? structuredClone(schema) : null;
    
    // Add thinking message
    addMessage('assistant', 'Applying your changes...');

    try {
      // If we have onApply handler, use it for direct patch application
      if (onApply) {
        // Create JSON patches based on instruction
        const patches: any[] = [];
        
        // Handle brand color changes
        if (instruction.toLowerCase().includes('brand color') || instruction.toLowerCase().includes('change color')) {
          patches.push({ op: "add", path: "/theme", value: {} }); // safe-guard
          
          if (instruction.toLowerCase().includes('red')) {
            patches.push({ op: "replace", path: "/theme/brandColor", value: "#dc2626" });
          } else if (instruction.toLowerCase().includes('blue')) {
            patches.push({ op: "replace", path: "/theme/brandColor", value: "#2563eb" });
          } else if (instruction.toLowerCase().includes('green')) {
            patches.push({ op: "replace", path: "/theme/brandColor", value: "#16a34a" });
          } else if (instruction.toLowerCase().includes('purple')) {
            patches.push({ op: "replace", path: "/theme/brandColor", value: "#9333ea" });
          }
        }

        // Handle testimonials
        if (instruction.toLowerCase().includes('testimonials') || instruction.toLowerCase().includes('testimonial')) {
          patches.push({ op: "add", path: "/content", value: {} });
          patches.push({ 
            op: "add", 
            path: "/content/testimonials", 
            value: {
              title: "What Our Customers Say",
              items: [
                {
                  name: "Sarah Johnson",
                  role: "CEO, Tech Corp",
                  content: "This solution transformed our business completely!",
                  avatar: ""
                },
                {
                  name: "Mike Chen",
                  role: "Product Manager",
                  content: "Outstanding service and incredible results.",
                  avatar: ""
                }
              ]
            }
          });
        }

        // Apply patches if we have any
        if (patches.length > 0) {
          await onApply({
            type: "patches",
            patches,
            note: "Changes applied from chat"
          });
          
          // Add success message
          addMessage('assistant', 'Changes applied successfully!', patches, schema);
          
          toast({
            title: "Changes applied",
            description: "Your edits were saved and synced.",
          });
        } else {
          addMessage('assistant', 'I couldn\'t understand that instruction. Try "change brand color to red" or "add testimonials".');
          toast({
            title: "No changes",
            description: "I couldn't understand that instruction",
            variant: "destructive",
          });
        }
      } else {
        // Fallback to old edit handler
        await onEdit(instruction, messages);
        
        // Create mock patch operations that will be enriched
        const mockOps: JsonPatchOp[] = [
          { 
            op: 'replace', 
            path: '/content', 
            value: instruction
          },
          { 
            op: 'add', 
            path: '/lastEdit', 
            value: { 
              instruction, 
              timestamp: Date.now(),
              messageCount: messages.length 
            }
          }
        ];

        // Enrich the operations with real before/after values if we have both schemas
        const enrichedOps = schemaBefore && schema 
          ? enrichPatchOps(mockOps, schemaBefore, schema)
          : mockOps;
        
        // Add success message with enriched operations and current schema
        addMessage('assistant', 'Changes applied successfully!', enrichedOps, schema);
        
        toast({
          title: "Changes applied",
          description: "Your edits were saved and synced.",
        });
      }
    } catch (error) {
      addMessage('assistant', 'Edit failed. Please try again or clarify your request.');
      toast({
        title: "Edit failed",
        description: "Please try again or clarify your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to history
    addMessage('user', input);
    
    // Determine whether to generate or edit
    if (shouldGenerate(input)) {
      handleGenerate(input);
    } else {
      handleEditRequest(input);
    }

    setInput('');
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleViewChanges = (ops: unknown[]) => {
    setChangesForView(ops);
    setChangesModalOpen(true);
  };

  const handleRestore = (snapshot: unknown) => {
    onSchemaUpdate(snapshot as StudioSchema);
  };

  const handleRerun = (prompt: string) => {
    setInput(prompt);
    
    // Add user message to history
    addMessage('user', prompt);
    
    // Determine whether to generate or edit and execute
    if (shouldGenerate(prompt)) {
      handleGenerate(prompt);
    } else {
      handleEditRequest(prompt);
    }
  };

  const exportChat = () => {
    const exportData = messages.map(({ id, role, content, timestamp, patchOps }) => ({
      id,
      role,
      content,
      timestamp: new Date(timestamp).toISOString(),
      patchOps: patchOps || [],
      hasChanges: patchOps && patchOps.length > 0,
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Modern Header */}
      <div className="relative p-6 border-b border-border/30 bg-gradient-to-r from-card/80 via-card/40 to-card/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gradient">AI Assistant</h2>
                <Badge variant="outline" className="text-xs font-medium bg-primary/10 border-primary/20 text-primary">
                  {schema ? 'Edit Mode' : 'Generate Mode'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{messages.length} messages</span>
                </div>
                {user && (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Synced</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CloudSyncBadge 
              messageCount={messages.length} 
              lastSyncAt={lastSyncAt}
              canLinkNow={canLinkNow}
              linking={linking}
              onLinkNow={handleLinkNow}
            />
            {!user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="glass border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                title="Sign in for cloud sync"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
            {isSpeakingSupported() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`hover-glow transition-all duration-200 ${ttsEnabled ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-primary'}`}
                title={ttsEnabled ? "Disable voice responses" : "Enable voice responses"}
              >
                {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
            {messages.length > 0 && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportChat}
                  className="text-muted-foreground hover:text-primary hover-glow transition-all duration-200"
                  title="Export chat history"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-muted-foreground hover:text-destructive hover-glow transition-all duration-200"
                  title="Clear chat history"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Messages Container */}
      <ScrollArea className="flex-1 p-6 scrollbar-modern" ref={scrollAreaRef}>
        {historyLoading ? (
          <div className="text-center py-12">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-xl opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading chat history</h3>
            <p className="text-sm text-muted-foreground">Syncing your conversations...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gradient mb-3">
              {schema ? 'Ready to enhance your page' : 'Let\'s create something amazing'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {schema 
                ? 'Tell me what changes you want to make and I\'ll help you bring your vision to life with precision and style.'
                : 'Describe your ideal page and I\'ll generate a beautiful, functional layout tailored to your needs.'
              }
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <Button variant="outline" size="sm" onClick={() => setInput('Create a modern hero section')} className="glass hover:scale-105 transition-all duration-200">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Hero
              </Button>
              <Button variant="outline" size="sm" onClick={() => setInput('Add contact form')} className="glass hover:scale-105 transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Form
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                } animate-in fade-in-50 duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.role === 'assistant' && (
                  <div className="relative group">
                    <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-glow transition-all duration-200">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                )}
                
                <div className={`max-w-[75%] space-y-2 ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <Card className={`p-4 card-modern ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 ml-auto' 
                      : 'bg-gradient-to-br from-card via-card/80 to-card/60 border-border/30'
                  }`}>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                      <div className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                      {message.patchOps && message.patchOps.length > 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          {message.patchOps.length} changes
                        </Badge>
                      )}
                    </div>
                    
                    <MessageActions
                      message={message}
                      onRestore={handleRestore}
                      onRerun={handleRerun}
                      onViewChanges={handleViewChanges}
                    />
                  </Card>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-in fade-in-50 duration-300">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-primary rounded-2xl animate-pulse opacity-30"></div>
                </div>
                <Card className="p-4 card-modern bg-gradient-to-br from-card via-card/80 to-card/60 border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-sm text-foreground font-medium">Crafting your response...</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Modern Quick Actions */}
      {schema && (
        <div className="px-6 py-4 border-t border-border/20 bg-gradient-to-r from-card/30 to-card/10">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Quick Actions</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 glass border-border/30 hover:scale-105 transition-all duration-200 text-left justify-start group"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{action.label}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{action.category}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modern Input Section */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-border/20 bg-gradient-to-r from-card/20 to-transparent">
        <div className="relative">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={schema ? "What changes would you like to make?" : "Describe the page you want to create..."}
                className="min-h-[48px] pr-24 text-sm glass border-border/30 bg-card/50 text-foreground placeholder:text-muted-foreground focus:shadow-glow focus:border-primary/30 transition-all duration-200 rounded-2xl"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <MicButton
                  onTranscript={(text) => setInput(text)}
                  lang="el-GR"
                  autoUpdate={true}
                  disabled={isLoading}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              size="lg"
              disabled={!input.trim() || isLoading}
              className="h-12 px-6 bg-gradient-primary hover:scale-105 transition-all duration-200 shadow-glow rounded-2xl group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Processing</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span className="text-sm font-medium">Send</span>
                </div>
              )}
            </Button>
          </div>
          
          {input.trim() && (
            <div className="mt-3 text-xs text-muted-foreground animate-in fade-in-50 duration-200">
              <p className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {shouldGenerate(input) ? 'Will generate new content' : 'Will edit existing content'}
              </p>
            </div>
          )}
        </div>
      </form>

      {/* Changes Modal */}
      <ChangesModal
        open={changesModalOpen}
        onClose={() => setChangesModalOpen(false)}
        operations={changesForView}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};